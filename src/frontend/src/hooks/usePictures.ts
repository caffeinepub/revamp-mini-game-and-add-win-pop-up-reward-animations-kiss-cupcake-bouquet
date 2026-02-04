import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Picture, PictureId } from '../backend';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

export function useGetPictures() {
  const { actor, isFetching } = useActor();

  return useQuery<Picture[]>({
    queryKey: ['pictures'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPictures();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPicture() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ blob, title, description }: { blob: ExternalBlob; title: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addPicture(blob, title, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pictures'] });
      toast.success('Picture added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add picture: ${error.message}`);
    },
  });
}

export function useUpdatePicture() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, blob, title, description }: { id: PictureId; blob: ExternalBlob; title: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updatePicture(id, blob, title, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pictures'] });
      toast.success('Picture updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update picture: ${error.message}`);
    },
  });
}

export function useDeletePicture() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: PictureId) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deletePicture(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pictures'] });
      toast.success('Picture deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete picture: ${error.message}`);
    },
  });
}

export function useReorderPictures() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderedIds: PictureId[]) => {
      if (!actor) throw new Error('Actor not available');
      await actor.reorderPictures(orderedIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pictures'] });
      toast.success('Pictures reordered successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to reorder pictures: ${error.message}`);
    },
  });
}
