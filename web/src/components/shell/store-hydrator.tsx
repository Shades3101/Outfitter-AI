"use client";

import { useEffect } from "react";
import { useOutfitter } from "@/lib/store";
import { PLACE_COOKIE, placeQuery } from "@/lib/weather";

/**
 * Reads the persisted state once the client is up, and keeps the location
 * mirrored into a cookie. The server pages render the forecast themselves and
 * the store lives in localStorage, so the cookie is the only way for them to
 * know which place the user picked.
 */
export function StoreHydrator() {
  useEffect(() => {
    void useOutfitter.persist?.rehydrate();

    const write = (settings: ReturnType<typeof useOutfitter.getState>["settings"]) => {
      const value = `${placeQuery(settings)}&units=${settings.units}`;
      document.cookie = `${PLACE_COOKIE}=${value}; path=/; max-age=31536000; samesite=lax`;
    };

    write(useOutfitter.getState().settings);
    return useOutfitter.subscribe((state, previous) => {
      if (state.settings !== previous.settings) write(state.settings);
    });
  }, []);

  return null;
}
