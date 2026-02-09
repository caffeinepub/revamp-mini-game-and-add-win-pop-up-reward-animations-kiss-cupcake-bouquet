import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useIsCallerAdmin } from './useAuthz';
import type { Message, MessageId } from '../backend';
import { toast } from 'sonner';
import { humanizeBackendError } from '@/utils/humanizeBackendError';

export function useGetMessages() {
  const { actor, isFetching } = useActor();
  const { data: isAdmin } = useIsCallerAdmin();

  return useQuery<Message[]>({
    queryKey: ['messages'],
    queryFn: async () => {
      if (!actor) return [];
      // For admin users, use getAllMessages to fetch the full list
      return actor.getAllMessages();
    },
    enabled: !!actor && !isFetching && !!isAdmin,
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
      queryClient.invalidateQueries({ queryKey: ['unlockedMessages'] });
      toast.success('Message added successfully');
    },
    onError: (error: Error) => {
      const message = humanizeBackendError(error);
      toast.error(message);
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
      queryClient.invalidateQueries({ queryKey: ['unlockedMessages'] });
      toast.success('Message updated successfully');
    },
    onError: (error: Error) => {
      const message = humanizeBackendError(error);
      toast.error(message);
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
      queryClient.invalidateQueries({ queryKey: ['unlockedMessages'] });
      toast.success('Message deleted successfully');
    },
    onError: (error: Error) => {
      const message = humanizeBackendError(error);
      toast.error(message);
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
      queryClient.invalidateQueries({ queryKey: ['unlockedMessages'] });
      toast.success('Messages reordered successfully');
    },
    onError: (error: Error) => {
      const message = humanizeBackendError(error);
      toast.error(message);
    },
  });
}
