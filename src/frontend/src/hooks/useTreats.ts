import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SweetTreat, TreatId } from '../backend';
import { toast } from 'sonner';

export function useGetAllTreats() {
  const { actor, isFetching } = useActor();

  return useQuery<SweetTreat[]>({
    queryKey: ['allTreats'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTreats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTreat() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, description, position }: { name: string; description: string; position: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addSweetTreat(name, description, position);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTreats'] });
      toast.success('Sweet treat added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add treat: ${error.message}`);
    },
  });
}

export function useUpdateTreat() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, description, position }: { id: TreatId; name: string; description: string; position: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateSweetTreat(id, name, description, position);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTreats'] });
      toast.success('Sweet treat updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update treat: ${error.message}`);
    },
  });
}

export function useDeleteTreat() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: TreatId) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteSweetTreat(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTreats'] });
      toast.success('Sweet treat deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete treat: ${error.message}`);
    },
  });
}

export function useReorderTreats() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderedIds: TreatId[]) => {
      if (!actor) throw new Error('Actor not available');
      await actor.reorderSweetTreats(orderedIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTreats'] });
      toast.success('Sweet treats reordered successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to reorder treats: ${error.message}`);
    },
  });
}
