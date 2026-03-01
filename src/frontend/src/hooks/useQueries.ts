import { useQuery } from "@tanstack/react-query";
import type { CreatorProfile } from "../backend.d.ts";
import { useActor } from "./useActor";

export function useGetAllCreators() {
  const { actor, isFetching } = useActor();
  return useQuery<CreatorProfile[]>({
    queryKey: ["allCreators"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCreators();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useGetUserCount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["userCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getUserCount();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
