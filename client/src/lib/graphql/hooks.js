import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { addMessageMutation, messageAddedSubscription, messagesQuery } from './queries';

export function useAddMessage() {
  const [mutate] = useMutation(addMessageMutation);

  const addMessage = async (text) => {
    const { data: { message } } = await mutate({
      variables: { text },
      // Not needed anymore because of the subscription
      // update: (cache, { data: { message } }) => {
      //   cache.updateQuery({ query: messagesQuery }, (oldData) => {
      //     return {
      //       messages: [...oldData.messages, message],
      //     }
      //   });
      // },
    });
    return message;
  };

  return { addMessage };
}

export function useMessages() {
  const { data } = useQuery(messagesQuery);
  useSubscription(messageAddedSubscription, {
    onData: ({ client, data: { data } }) => {
      const newMessage = data.message;
      client.cache.updateQuery({ query: messagesQuery }, (oldData) => {
        return {
          messages: [...oldData.messages, newMessage],
        }
      });
    },
  });
  return {
    messages: data?.messages ?? [],
  };
}
