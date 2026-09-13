import { isResting } from "@/lib/time";
import type { Formality, Item, Outfit, Settings, Slot } from "@/lib/types";
import type { Weather } from "@/lib/weather";

/**
 * Choosing what to wear.
 *
 * Both screens promised picks "built from your wardrobe, the weather and your
 * day" and then rendered two hardcoded outfits. This is small and legible
 * rather than clever: score every candidate piece against the temperature, the
 * rain and the dressiest thing on the schedule, skip anything still resting,
 * and take the best in each slot.
 */

const WARMTH_ORDER = ["Light", "Medium", "Warm", "Very warm"] as const;
const FORMALITY_ORDER: Formality[] = [
  "Very casual",
  "Casual",
  "Smart casual",
  "Formal",
];

/** Roughly how much insulation the day calls for, on the warmth scale. */
function warmthWanted(tempC: number): number {
  if (tempC >= 26) return 0;
  if (tempC >= 18) return 1;
  if (tempC >= 10) return 2;
  return 3;
}

/** The dressiest thing the day asks for. */
export function formalityWanted(
  schedule: Slot[],
  map: Settings["formalityMap"]
): Formality {
  let best = 1; // Casual, when the day says nothing
  for (const slot of schedule) {
    const formality = map[slot.kind];
    if (formality) best = Math.max(best, FORMALITY_ORDER.indexOf(formality));
  }
  return FORMALITY_ORDER[best];
}

function score(
  item: Item,
  tempC: number,
  wet: boolean,
  wanted: Formality
): number {
  const warmthGap = Math.abs(
    WARMTH_ORDER.indexOf(item.warmth) - warmthWanted(tempC)
  );
  const formalityGap = Math.abs(
    FORMALITY_ORDER.indexOf(item.formality) - FORMALITY_ORDER.indexOf(wanted)
  );
  let s = 100 - warmthGap * 22 - formalityGap * 18;
  // Linen in the rain is a bad afternoon.
  if (wet && (item.material === "Linen" || item.material === "Suede")) s -= 25;
  if (wet && item.material === "Nylon") s += 8;
  return s;
}

const CATEGORY_ORDER = ["Tops", "Bottoms", "Shoes", "Outerwear"] as const;

/** The reasons a pick was made, printed under it as chips. */
export interface PickReason {
  temp: string;
  sky: string;
  day: string;
}

export function buildOutfits(
  items: Item[],
  schedule: Slot[],
  settings: Settings,
  weather: Weather,
  now = Date.now()
): { outfits: Outfit[]; reason: PickReason } {
  const tempC =
    weather.unit === "F" ? ((weather.now.temp - 32) * 5) / 9 : weather.now.temp;
  const wet = (weather.hourly[0]?.pop ?? 0) >= 40;
  const wanted = formalityWanted(schedule, settings.formalityMap);
  const cold = tempC < 16;

  const ranked = (cat: string, skip: Set<string>) =>
    items
      .filter((i) => i.cat === cat && !skip.has(i.id))
      .map((i) => ({
        item: i,
        // A piece worn recently drops down the list rather than out of it, so
        // a small wardrobe still returns two outfits.
        s:
          score(i, tempC, wet, wanted) -
          (isResting(i.lastWorn, settings.restDays, now) ? 45 : 0),
      }))
      .sort((a, b) => b.s - a.s)
      .map((x) => x.item);

  const used = new Set<string>();
  const pick = (rank: string, note: string): Outfit | null => {
    const ids: string[] = [];
    for (const cat of CATEGORY_ORDER) {
      if (cat === "Outerwear" && !cold && !wet) continue;
      const best = ranked(cat, used)[0];
      if (best) {
        ids.push(best.id);
        used.add(best.id);
      }
    }
    return ids.length >= 2 ? { id: rank.toLowerCase(), ids, rank, note } : null;
  };

  const skyNote = wet
    ? "rain in the next hour"
    : cold
      ? "a cold start"
      : "the warmth";
  const outfits = [
    pick("First pick", `Built for ${skyNote} and a ${wanted.toLowerCase()} day.`),
    pick("Alternate", `Same brief, nothing repeated from the first pick.`),
  ].filter((o) => o !== null);

  return {
    outfits,
    reason: {
      temp: `${weather.now.temp}°${weather.unit}`,
      sky: wet ? "Rain likely" : weather.now.label,
      day: schedule.length
        ? schedule.map((s) => s.kind).join(", ")
        : "nothing scheduled",
    },
  };
}
