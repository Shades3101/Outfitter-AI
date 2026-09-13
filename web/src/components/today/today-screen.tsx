"use client";

import { useMemo, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { PageHeader } from "@/components/page-header";
import { DayTimeline } from "./day-timeline";
import { OutfitCard } from "./outfit-card";
import { WeatherCard } from "./weather-card";
import { LEDE } from "@/data/weather";
import type { Weather } from "@/lib/weather";
import { useOutfitter } from "@/lib/store";
import { dateLine } from "@/lib/time";
import { stagger } from "@/lib/motion";
import { buildOutfits } from "@/lib/picks";

/** The date only changes with the clock; nothing to subscribe to. */
const subscribeNothing = () => () => {};

export function TodayScreen({
  weather,
  today,
}: {
  weather: Weather;
  today: string;
}) {
  const items = useOutfitter((st) => st.items);
  const schedule = useOutfitter((st) => st.schedule);
  const settings = useOutfitter((st) => st.settings);
  // The picks are derived, not stored: change a slot or delete a piece and
  // they rebuild, which is what both screens have always claimed happens.
  const { outfits, reason } = useMemo(
    () => buildOutfits(items, schedule, settings, weather),
    [items, schedule, settings, weather]
  );
  // The server renders in its own timezone, which is the wrong day either side
  // of midnight for most readers. The server value is the hydration snapshot;
  // the client recomputes it in the reader's own zone.
  const date = useSyncExternalStore(
    subscribeNothing,
    () => dateLine(),
    () => today
  );

  return (
    <>
      <PageHeader title={date} lede={LEDE} />

      <div className="mb-8 grid gap-5 lg:grid-cols-2">
        <WeatherCard weather={weather} />
        <DayTimeline />
      </div>

      <motion.div
        variants={stagger()}
        initial="hidden"
        animate="show"
        className="grid gap-5 md:grid-cols-2"
      >
        {outfits.map((outfit) => (
          <OutfitCard key={outfit.id} outfit={outfit} reason={reason} />
        ))}
      </motion.div>
    </>
  );
}
