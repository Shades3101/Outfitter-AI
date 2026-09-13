"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Garment } from "@/components/garment";
import { ItemFields } from "./item-fields";
import { COPY } from "@/data/copy";
import { SHAPE_FOR_CATEGORY } from "@/data/garment-shapes";
import { SHAPES_BY_CATEGORY } from "@/data/options";
import { useOutfitter } from "@/lib/store";
import { EASE_OUT } from "@/lib/motion";
import type { Category, EditableKey, Item } from "@/lib/types";

/** What the demo "recogniser" comes back with. */
const DETECTED: Omit<Item, "id"> = {
  name: "Olive linen shirt",
  cat: "Tops",
  shape: "shirt",
  colorName: "Olive",
  warmth: "Light",
  formality: "Smart casual",
  material: "Linen",
  lastWorn: null,
};

/**
 * A real file, with the tagging still mocked — that part is the demo. The zone
 * used to accept nothing at all: no input, no drop handler, and every added
 * piece came back as the same "Olive linen shirt".
 */
function usePhotoDraft(onReady: (draft: Omit<Item, "id">) => void) {
  const [over, setOver] = useState(false);
  // A callback ref, so nothing reads `.current` during render.
  const [input, setInput] = useState<HTMLInputElement | null>(null);

  const accept = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) {
      toast("That file isn't an image.");
      return;
    }
    onReady({
      ...DETECTED,
      // Named from the file so two additions are never indistinguishable.
      name: file.name.replace(/\.[^.]+$/, "").slice(0, 40) || DETECTED.name,
      photo: URL.createObjectURL(file),
    });
  };

  return {
    over,
    ref: setInput,
    open: () => input?.click(),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setOver(false);
      accept(e.dataTransfer.files[0]);
    },
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setOver(true);
    },
    onDragLeave: () => setOver(false),
    onPick: (e: React.ChangeEvent<HTMLInputElement>) =>
      accept(e.target.files?.[0]),
  };
}

export function AddItemDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const addItem = useOutfitter((s) => s.addItem);
  const [draft, setDraft] = useState<Omit<Item, "id"> | null>(null);
  const { ref: fileInput, ...photo } = usePhotoDraft(setDraft);

  const close = () => {
    onOpenChange(false);
    setDraft(null);
  };

  const change = (key: EditableKey, value: string) =>
    setDraft((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [key]: value };
      if (
        key === "cat" &&
        !SHAPES_BY_CATEGORY[value as Category].includes(next.shape)
      ) {
        next.shape = SHAPE_FOR_CATEGORY[value as Category];
      }
      if (key === "shape") next.shape = value as Item["shape"];
      return next;
    });

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      <DialogContent className="max-w-[660px] rounded-[18px] bg-paper p-7 sm:max-w-[660px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-[-0.02em]">
            Add an item
          </DialogTitle>
          <DialogDescription className="sr-only">
            Upload a photo and confirm the tags.
          </DialogDescription>
        </DialogHeader>

        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          hidden
          onChange={photo.onPick}
        />

        <AnimatePresence mode="wait" initial={false}>
          {draft === null ? (
            <motion.button
              key="drop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: EASE_OUT }}
              onClick={photo.open}
              onDrop={photo.onDrop}
              onDragOver={photo.onDragOver}
              onDragLeave={photo.onDragLeave}
              className={`w-full rounded-[14px] border border-dashed px-5 py-13 text-center transition-colors ${
                photo.over
                  ? "border-ink bg-linen-2"
                  : "border-stitch bg-linen hover:bg-linen-2"
              }`}
            >
              <Camera
                className="mx-auto mb-3.5 size-11 opacity-50"
                strokeWidth={1.4}
                aria-hidden
              />
              <div className="text-base font-semibold">
                Drop a photo, or click to browse
              </div>
              <div className="mt-1 text-[13.5px] text-ink-soft">
                One garment per photo, plain background works best
              </div>
            </motion.button>
          ) : (
            <motion.div
              key="tags"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
            >
              <div className="grid items-start gap-6 sm:grid-cols-[220px_minmax(0,1fr)]">
                <div className="grid place-items-center rounded-[13px] bg-linen p-5">
                  <Garment item={draft} className="max-h-[190px]" />
                </div>
                <div>
                  <p className="mx-0.5 mb-2 text-[13px] text-ink-soft">
                    <b className="font-semibold text-ochre-ink">Auto-tagged.</b>{" "}
                    Check colour and material, those two slip most often.
                  </p>
                  <ItemFields item={draft} onChange={change} />
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2.5">
                <button
                  onClick={() => {
                    addItem(draft);
                    toast(COPY.added);
                    close();
                  }}
                  className="rounded-[10px] bg-ink px-5 py-3 text-[14.5px] font-semibold text-paper transition-colors hover:bg-indigo"
                >
                  Add to wardrobe
                </button>
                <button
                  onClick={close}
                  className="px-4 py-3 text-sm text-ink-soft hover:text-ink"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
