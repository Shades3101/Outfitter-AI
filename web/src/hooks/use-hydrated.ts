"use client";

import { useSyncExternalStore } from "react";
import { useOutfitter } from "@/lib/store";

const noopSubscribe = () => () => {};

/**
 * True once the persisted store has been read back from localStorage.
 * Use it to hold back counts that would otherwise flash the seed value.
 * The persist API is absent while prerendering, hence the guards.
 */
export function useHydrated() {
  return useSyncExternalStore(
    useOutfitter.persist?.onFinishHydration ?? noopSubscribe,
    () => useOutfitter.persist?.hasHydrated() ?? false,
    () => false
  );
}
