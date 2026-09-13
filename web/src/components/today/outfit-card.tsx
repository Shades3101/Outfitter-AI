"use client";

import { motion } from "motion/react";
import { toast } from "sonner";
import { Garment } from "@/components/garment";
import { COPY } from "@/data/copy";
import { itemById, useOutfitter } from "@/lib/store";
import { fadeUp } from "@/lib/motion";
import type { Outfit } from "@/lib/types";
import type { PickReason } from "@/lib/picks";

export function OutfitCard({
  outfit,
  reason,
}: {
  outfit: Outfit;
  reason: PickReason;
}) {
  const items = useOutfitter((s) => s.items);
  const chosenId = useOutfitter((s) => s.chosenOutfitId);
  const dismissed = useOutfitter((s) => s.dismissed[outfit.id] ?? false);
  const restDays = useOutfitter((s) => s.settings.restDays);
  const wearOutfit = useOutfitter((s) => s.wearOutfit);
  const toggleDismissed = useOutfitter((s) => s.toggleDismissed);

  const pieces = outfit.ids
    .map((id) => itemById(items, id))
    .filter((item) => item !== undefined);
  const chosen = chosenId === outfit.id;

  return (
    <motion.article
      variants={fadeUp}
      animate={{ opacity: dismissed ? 0.4 : 1 }}
      className="relative rounded-2xl bg-paper p-4 pb-[18px] text-ink"
    >
      {chosen ? (
        <motion.span
          layoutId="chosen-ring"
          className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-sage ring-inset"
          transition={{ type: "spring", stiffness: 400, damping: 34 }}
        />
      ) : null}

      <span className="m-0.5 mb-3 block text-[11px] font-semibold tracking-[0.1em] text-ink-soft">
        {outfit.rank}
      </span>

      {/* Three pieces read as a hero and two supports; four fill an even grid,
          rather than stranding the fourth alone in a third row. */}
      <div
        className={
          pieces.length === 3
            ? "grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] grid-rows-2 gap-2.5"
            : "grid grid-cols-2 gap-2.5"
        }
      >
        {pieces.map((piece, i) => (
          <div
            key={piece.id}
            className={`group relative grid min-h-[104px] place-items-center rounded-[11px] bg-linen p-3 pb-7 transition-colors hover:bg-linen-2 sm:min-h-[128px] ${
              i === 0 && pieces.length === 3 ? "row-span-2" : ""
            }`}
          >
            <Garment item={piece} className="max-h-[150px]" />
            {/* Always readable: on a touch screen there is no hover, and this was
                the only text naming the piece. */}
            <span className="absolute right-2 bottom-2 left-[11px] truncate text-[12px] text-ink-soft transition-colors group-hover:text-ink">
              {piece.name}
            </span>
          </div>
        ))}
      </div>

      <p className="mx-0.5 mt-4 mb-2.5 max-w-[52ch] font-serif text-[18px] leading-[1.4] italic">
        {outfit.note}
      </p>

      {/* What the pick was actually made from, so the claim is checkable. */}
      <ul className="mx-0.5 mb-3.5 flex flex-wrap gap-1.5">
        {[reason.temp, reason.sky, reason.day].map((chip) => (
          <li
            key={chip}
            className="rounded-full bg-linen px-2.5 py-1 text-[11.5px] text-ink-soft"
          >
            {chip}
          </li>
        ))}
      </ul>

      <div className="flex gap-2.5">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            wearOutfit(outfit.id, outfit.ids);
            toast(COPY.wore(restDays));
          }}
          className={`rounded-[10px] px-5 py-2.5 text-[14.5px] font-semibold text-paper transition-colors ${
            chosen ? "bg-sage" : "bg-ink hover:bg-indigo"
          }`}
        >
          {chosen ? "Wearing today" : "Wear this"}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          aria-pressed={dismissed}
          onClick={() => {
            const next = toggleDismissed(outfit.id);
            // Waving off the outfit you are wearing quietly un-wears it, so
            // say that rather than leaving the change to be noticed later.
            toast(next ? (chosen ? COPY.unwore : COPY.dismissed) : COPY.restored);
          }}
          className={`rounded-[10px] border px-[18px] py-2.5 text-[14.5px] transition-colors ${
            dismissed
              ? "border-ink bg-linen-2 font-medium text-ink"
              : "border-stitch text-ink-soft hover:border-ink"
          }`}
        >
          {dismissed ? "Set aside · Undo" : "Not today"}
        </motion.button>
      </div>
    </motion.article>
  );
}
