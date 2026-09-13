import type { Outfit, Slot } from "@/lib/types";

export const SEED_OUTFITS: Outfit[] = [
  {
    id: "a",
    ids: ["2", "7", "12", "10"],
    rank: "First pick",
    note: "Light weave for the humidity, and the stone chinos still read office at 7:30.",
  },
  {
    id: "b",
    ids: ["3", "6", "14"],
    rank: "Alternate",
    note: "Skips the oxford you wore Monday, and loafers lift it for dinner.",
  },
];

export const SEED_SCHEDULE: Slot[] = [
  { id: "s1", time: "7:00", kind: "Gym" },
  { id: "s2", time: "10:00", kind: "Office" },
  { id: "s3", time: "19:30", kind: "Dinner out" },
];
