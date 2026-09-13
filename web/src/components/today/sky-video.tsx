"use client";

import { useRef, useState } from "react";
import { cn } from "cn";
import type { SkyClipSource } from "@/lib/sky-clip";

/** Seconds of overlap between the outgoing copy and the incoming one. */
const FADE = 1.2;

/**
 * The moving sky: a short, silent, self-hosted loop of the real weather.
 *
 * It sits over the photograph rather than replacing it, so the still holds the
 * frame while the loop buffers and keeps it if the loop cannot play at all.
 * `prefers-reduced-motion` is handled by the caller, which does not render
 * this at all — a paused video still downloads.
 *
 * Two copies of the clip, not one on `loop`. A looping video cuts from its
 * last frame to its first, and on a slow sky that jump is the only sudden
 * movement on the page. Instead the second copy starts a beat before the first
 * one ends and the two crossfade, so the seam reads as drifting cloud.
 */
export function SkyVideo({
  clip,
  blur = false,
}: {
  clip: SkyClipSource;
  /** Soften the footage to match the still it plays over. */
  blur?: boolean;
}) {
  /** Held by src rather than a flag, so a changed clip is unready for free. */
  const [readyFor, setReadyFor] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  /** Which copy is currently on top. */
  const [front, setFront] = useState(0);
  /** Opacity per copy. Both are lit through a handoff, never through a cut. */
  const [lit, setLit] = useState([false, false]);
  const videos = useRef<(HTMLVideoElement | null)[]>([null, null]);

  if (failed) return null;

  /** Autoplay needs the property set, not the attribute React writes. */
  const start = (element: HTMLVideoElement) => {
    element.muted = true;
    void element.play().catch(() => {});
  };

  // Watched on the visible copy only, so the pair can't hand off to each other
  // in a loop. `timeupdate` fires about four times a second — often enough for
  // a fade measured in whole seconds.
  const onTimeUpdate = (index: number) => {
    if (index !== front) return;
    const current = videos.current[index];
    const other = videos.current[1 - index];
    if (!current || !other || !Number.isFinite(current.duration)) return;
    // A clip shorter than two fades would spend its whole length crossfading.
    const fade = Math.min(FADE, current.duration / 3);
    if (current.duration - current.currentTime > fade) return;

    other.currentTime = 0;
    start(other);
    // The incoming copy fades up on top; the outgoing one stays fully opaque
    // underneath, so the still never shows through the middle of the handoff.
    setFront(1 - index);
    setLit([true, true]);
    // Once the fade is over the outgoing copy is completely covered, so it can
    // be dimmed unseen — and is then ready to fade up again on its next turn.
    window.setTimeout(
      () => setLit(index === 0 ? [false, true] : [true, false]),
      FADE * 1000
    );
  };

  return (
    <>
      {[0, 1].map((index) => (
        <video
          key={`${clip.src}-${index}`}
          src={clip.src}
          // Only the first copy shows a poster; the second is always behind
          // footage that is already on screen.
          poster={index === 0 ? clip.poster : undefined}
          autoPlay={index === 0}
          muted
          playsInline
          preload="auto"
          aria-hidden
          ref={(element) => {
            videos.current[index] = element;
            if (element && index === 0) start(element);
          }}
          onTimeUpdate={() => onTimeUpdate(index)}
          // Whichever copy runs out is the one that just faded away; parking it
          // at the start keeps it ready for its next turn.
          onEnded={(event) => {
            event.currentTarget.pause();
            event.currentTarget.currentTime = 0;
          }}
          onCanPlay={() => {
            setReadyFor(clip.src);
            // The first copy fades up off the poster; the second waits its turn.
            if (index === 0) setLit(([, back]) => [true, back]);
          }}
          onError={() => setFailed(true)}
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity",
            // Exactly the still beneath it — same blur, same scale — so the
            // fade from poster frame to moving footage changes nothing but the
            // motion. (16px was tried and turned a drizzle clip into a brown
            // smear.) `scale` hides the transparent edge the blur would
            // otherwise feather in from the corners, the same trick the
            // photograph underneath uses.
            blur ? "scale-110 blur-[7px]" : "scale-105",
            readyFor === clip.src && lit[index] ? "opacity-100" : "opacity-0"
          )}
          style={{
            transitionDuration: `${FADE * 1000}ms`,
            // Only the stacking moves at a handoff: the copy taking over sits
            // above and fades up, and next time round the two swap places.
            zIndex: front === index ? 1 : 0,
          }}
        />
      ))}
    </>
  );
}
