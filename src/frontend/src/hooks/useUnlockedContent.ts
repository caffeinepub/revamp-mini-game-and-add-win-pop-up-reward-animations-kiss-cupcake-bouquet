import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Picture, Message, SweetTreat } from '../backend';

export function useGetUnlockedPictures() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Picture[]>({
    queryKey: ['unlockedPictures', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      const pictures = await actor.getUnlockedPictures();
      return pictures.sort((a, b) => Number(a.position) - Number(b.position));
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

export function useGetUnlockedMessages() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Message[]>({
    queryKey: ['unlockedMessages', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      const messages = await actor.getUnlockedMessages();
      return messages.sort((a, b) => Number(a.position) - Number(b.position));
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

export function useGetUnlockedTreats() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<SweetTreat[]>({
    queryKey: ['unlockedTreats', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      const treats = await actor.getUnlockedTreats();
      return treats.sort((a, b) => Number(a.position) - Number(b.position));
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}
