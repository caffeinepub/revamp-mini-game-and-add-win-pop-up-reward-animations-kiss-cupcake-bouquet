import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Message, MessageId } from '../backend';
import { toast } from 'sonner';

export function useGetMessages() {
  const { actor, isFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ['messages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMessages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, position }: { content: string; position: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addMessage(content, position);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success('Message added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add message: ${error.message}`);
    },
  });
}

export function useUpdateMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, content, position }: { id: MessageId; content: string; position: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateMessage(id, content, position);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success('Message updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update message: ${error.message}`);
    },
  });
}

export function useDeleteMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: MessageId) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteMessage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success('Message deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete message: ${error.message}`);
    },
  });
}

export function useReorderMessages() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderedIds: MessageId[]) => {
      if (!actor) throw new Error('Actor not available');
      await actor.reorderMessages(orderedIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success('Messages reordered successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to reorder messages: ${error.message}`);
    },
  });
}
