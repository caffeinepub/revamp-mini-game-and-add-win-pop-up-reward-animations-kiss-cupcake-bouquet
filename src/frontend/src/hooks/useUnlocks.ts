import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';

export function useIncrementUnlocks() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return await actor.incrementUnlocks(true, true, true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unlockedPictures'] });
      queryClient.invalidateQueries({ queryKey: ['unlockedMessages'] });
      queryClient.invalidateQueries({ queryKey: ['unlockedTreats'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to unlock content: ${error.message}`);
    },
  });
}
