"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SEED_ITEMS } from "@/data/items";
import { SEED_SCHEDULE } from "@/data/outfits";
import { SEED_SETTINGS } from "@/data/settings";
import { SHAPE_FOR_CATEGORY } from "@/data/garment-shapes";
import { SHAPES_BY_CATEGORY } from "@/data/options";
import { toMinutes } from "@/lib/time";
import type {
  Category,
  Item,
  Settings,
  Slot,
  SlotKind,
} from "@/lib/types";

export type Filter = Category | "All";

interface OutfitterState {
  items: Item[];
  schedule: Slot[];
  settings: Settings;
  /** Outfit the user committed to today. */
  chosenOutfitId: string | null;
  /** Outfits the user waved off. */
  dismissed: Record<string, boolean>;
  /** Wardrobe category filter (not persisted). */
  filter: Filter;

  setFilter: (filter: Filter) => void;
  updateItem: (id: string, patch: Partial<Item>) => void;
  removeItem: (id: string) => void;
  /** Put a removed item back where it was, for Undo. */
  restoreItem: (item: Item, at?: number) => void;
  addItem: (draft: Omit<Item, "id">) => void;
  wearOutfit: (id: string, ids: string[]) => void;
  toggleDismissed: (id: string) => boolean;
  /** Returns false when that slot is already on the day. */
  addSlot: (time: string, kind: SlotKind) => boolean;
  removeSlot: (id: string) => void;
  /** Put a removed slot back, for Undo. */
  restoreSlot: (slot: Slot) => void;
  updateSettings: (patch: Partial<Settings>) => void;
}

/**
 * `crypto.randomUUID` only exists in a secure context, so it is absent when the
 * app is opened over plain http on a LAN address — which is how you test on a
 * phone. Falling back keeps Add working there.
 */
const newId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const sortSlots = (slots: Slot[]) =>
  [...slots].sort((a, b) => toMinutes(a.time) - toMinutes(b.time));

export const useOutfitter = create<OutfitterState>()(
  persist(
    (set, get) => ({
      items: SEED_ITEMS,
      schedule: SEED_SCHEDULE,
      settings: SEED_SETTINGS,
      chosenOutfitId: null,
      dismissed: {},
      filter: "All",

      setFilter: (filter) => set({ filter }),

      updateItem: (id, patch) =>
        set((s) => ({
          items: s.items.map((item) => {
            if (item.id !== id) return item;
            const next = { ...item, ...patch };
            // Keep the drawing in step with the category, but only when the
            // chosen one no longer belongs to it — otherwise an edit would
            // silently throw away a knit or a boot.
            if (patch.cat && !SHAPES_BY_CATEGORY[patch.cat].includes(next.shape)) {
              next.shape = SHAPE_FOR_CATEGORY[patch.cat];
            }
            return next;
          }),
        })),

      removeItem: (id) =>
        set((s) => ({
          items: s.items.filter((item) => item.id !== id),
        })),

      restoreItem: (item) =>
        set((s) => ({
          items: s.items.some((x) => x.id === item.id)
            ? s.items
            : [...s.items, item],
        })),

      addItem: (draft) =>
        set((s) => ({
          items: [
            ...s.items,
            {
              ...draft,
              shape: draft.shape ?? SHAPE_FOR_CATEGORY[draft.cat],
              id: newId(),
            },
          ],
        })),

      wearOutfit: (id, ids) =>
        set((s) => {
          // Recording the wear is the whole point of the button: it is what
          // gives the rest period something to measure against.
          const now = Date.now();
          const wornIds = new Set(ids);
          return {
            chosenOutfitId: id,
            dismissed: { ...s.dismissed, [id]: false },
            items: s.items.map((item) =>
              wornIds.has(item.id) ? { ...item, lastWorn: now } : item
            ),
          };
        }),

      toggleDismissed: (id) => {
        const next = !get().dismissed[id];
        set((s) => ({
          dismissed: { ...s.dismissed, [id]: next },
          chosenOutfitId: next && s.chosenOutfitId === id ? null : s.chosenOutfitId,
        }));
        return next;
      },

      addSlot: (time, kind) => {
        // The same thing twice at the same time is a mis-click, not a plan.
        if (get().schedule.some((s) => s.time === time && s.kind === kind)) {
          return false;
        }
        set((s) => ({
          schedule: sortSlots([...s.schedule, { id: newId(), time, kind }]),
        }));
        return true;
      },

      removeSlot: (id) =>
        set((s) => ({ schedule: s.schedule.filter((slot) => slot.id !== id) })),

      restoreSlot: (slot) =>
        set((s) => ({
          schedule: s.schedule.some((x) => x.id === slot.id)
            ? s.schedule
            : sortSlots([...s.schedule, slot]),
        })),

      updateSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),
    }),
    {
      name: "outfitter-web-v1",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      // The server render and the first client render must match, so the
      // store starts from the seed data and rehydrates in an effect.
      /**
       * v1 stored `worn` as prose and (in Gallery) the kind "Dinner".
       * Drop the prose — an unknown last-worn date is honestly null — and
       * move the kind onto the shared name.
       */
      migrate: (state, version) => {
        if (version >= 2) return state as never;
        const s = state as {
          items?: { worn?: string; lastWorn?: number | null }[];
          schedule?: { kind: string }[];
        };
        s.items?.forEach((item) => {
          if (item.lastWorn === undefined) item.lastWorn = null;
          delete item.worn;
        });
        s.schedule?.forEach((slot) => {
          if (slot.kind === "Dinner") slot.kind = "Dinner out";
        });
        return s as never;
      },
      skipHydration: true,
      partialize: (s) => ({
        items: s.items,
        schedule: s.schedule,
        settings: s.settings,
        chosenOutfitId: s.chosenOutfitId,
        dismissed: s.dismissed,
      }),
    }
  )
);

/** Look an item up by id. */
export const itemById = (items: Item[], id: string) =>
  items.find((item) => item.id === id);
