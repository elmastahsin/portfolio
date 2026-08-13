"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  SPRING_SETTLE,
  SPRING_SHEET,
  SpringHandle,
  VelocityTracker,
  prefersReducedMotion,
  project,
  rubberband,
  spring,
} from "@/lib/spring";

/** Movement before a press is treated as a drag rather than a tap. */
const DRAG_THRESHOLD = 10;

interface SheetProps {
  open: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
}

/**
 * A bottom sheet you can throw.
 *
 * The properties that make it feel physical rather than scripted:
 *  - it tracks the finger 1:1, from wherever it was grabbed
 *  - it can be grabbed mid-animation and reversed, with no jump and no wait
 *  - on release it continues at the finger's exact velocity, so there is no
 *    seam between dragging and animating
 *  - the dismiss decision comes from where the flick is *going*, not where the
 *    finger happened to lift
 *  - it resists rather than stops at the top edge
 *  - it leaves along the same path it arrived on
 */
export default function Sheet({ open, onClose, label, children }: SheetProps) {
  const [prevOpen, setPrevOpen] = useState(open);
  const [exiting, setExiting] = useState(false);
  const exitRunningRef = useRef(false);
  const exitVelocityRef = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const springRef = useRef<SpringHandle | null>(null);
  const tracker = useRef(new VelocityTracker());
  const dragRef = useRef<{
    pointerId: number;
    startY: number;
    grabOffset: number;
    active: boolean;
  } | null>(null);
  const yRef = useRef(0);
  const heightRef = useRef(0);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  /** Push a value to the DOM directly. Per-frame React state would put the
   *  render pipeline between the finger and the pixels. */
  const paint = useCallback((y: number) => {
    yRef.current = y;
    const height = heightRef.current || 1;
    if (sheetRef.current) {
      sheetRef.current.style.transform = `translate3d(0, ${y}px, 0)`;
    }
    if (scrimRef.current) {
      // The scrim tracks the sheet continuously, so the background dims in
      // proportion to the drag rather than snapping at the end.
      scrimRef.current.style.opacity = String(
        Math.max(0, Math.min(1, 1 - y / height))
      );
    }
  }, []);

  const animateTo = useCallback(
    (
      target: number,
      velocity: number,
      config = SPRING_SETTLE,
      onSettle?: () => void
    ) => {
      springRef.current?.stop();

      if (prefersReducedMotion()) {
        // Reduced motion still gets the state change, just without travelling
        // through it. Deferred a frame so callers behave the same either way.
        paint(target);
        const raf = requestAnimationFrame(() => onSettle?.());
        springRef.current = null;
        void raf;
        return;
      }

      springRef.current = spring(
        yRef.current,
        target,
        config,
        (value) => paint(value),
        () => {
          springRef.current = null;
          onSettle?.();
        },
        velocity
      );
    },
    [paint]
  );

  /** Ask the parent to close, remembering the velocity the gesture ended with
   *  so the exit can continue at exactly that speed. */
  const requestDismiss = useCallback(
    (velocity: number) => {
      exitVelocityRef.current = velocity;
      onClose();
    },
    [onClose]
  );

  // Mount is derived, not set from an effect: render while open, and keep
  // rendering through the exit so the sheet can animate off rather than
  // vanishing. Adjusting state during render is the supported way to react to
  // a prop change without a cascading re-render.
  if (prevOpen !== open) {
    setPrevOpen(open);
    setExiting(!open);
  }
  const mounted = open || exiting;

  // Exit. Leaves downward, the same path it arrived on - a panel that enters
  // one way and leaves another reads as two unrelated things.
  useEffect(() => {
    if (!exiting || exitRunningRef.current) return;
    exitRunningRef.current = true;

    const velocity = exitVelocityRef.current;
    exitVelocityRef.current = 0;
    animateTo(heightRef.current, velocity, SPRING_SETTLE, () => setExiting(false));
  }, [exiting, animateTo]);

  // Entry. Measured after mount so the sheet starts exactly offscreen at its
  // real height rather than at a guessed one.
  useEffect(() => {
    if (!open) return;
    const element = sheetRef.current;
    if (!element) return;

    heightRef.current = element.offsetHeight;
    restoreFocusRef.current = document.activeElement as HTMLElement;
    // Reopening: clear the latch so a later close can run its exit again.
    exitRunningRef.current = false;

    if (prefersReducedMotion()) {
      paint(0);
      return;
    }
    paint(heightRef.current);
    // Two frames: one for the browser to accept the start transform, one to
    // begin the spring, so the sheet never flashes at its open position.
    const raf = requestAnimationFrame(() => animateTo(0, 0, SPRING_SHEET));
    return () => cancelAnimationFrame(raf);
  }, [open, animateTo, paint]);

  // Escape, focus restore, and background scroll lock.
  useEffect(() => {
    if (!mounted) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      restoreFocusRef.current?.focus?.();
    };
  }, [mounted, onClose]);

  const onPointerDown = (event: React.PointerEvent) => {
    if (prefersReducedMotion()) return;
    // Grabbing mid-flight: stop where it visibly is, not where it was headed.
    // Reading the presentation value here is what prevents the jump.
    const live = springRef.current?.stop();
    if (live) {
      yRef.current = live.value;
      springRef.current = null;
    }

    heightRef.current = sheetRef.current?.offsetHeight || heightRef.current;
    // Respect where they grabbed it. Snapping the sheet to the finger breaks
    // the illusion instantly.
    dragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      grabOffset: event.clientY - yRef.current,
      active: false,
    };
    tracker.current.reset();
    tracker.current.add(yRef.current, event.timeStamp);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (!drag.active) {
      // Hysteresis. Below the threshold this is still a tap, so capture is
      // withheld - taking the pointer early would retarget the click and the
      // buttons inside the sheet would stop working.
      if (Math.abs(event.clientY - drag.startY) < DRAG_THRESHOLD) return;
      drag.active = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    let y = event.clientY - drag.grabOffset;
    if (y < 0) {
      // Past the open position. Resist progressively instead of clamping - a
      // hard stop reads as broken, resistance reads as "nothing more here".
      y = -rubberband(-y, heightRef.current || 1);
    }
    tracker.current.add(y, event.timeStamp);
    paint(y);
  };

  const endDrag = (event: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    // Never moved past the threshold, so nothing was dragged and the tap that
    // is about to become a click is left alone.
    if (!drag.active) return;

    const velocity = tracker.current.velocity;
    const height = heightRef.current || 1;

    // Decide from the projected resting point, not the release point. A short
    // fast flick should dismiss even though the sheet barely moved.
    const projectedEnd = yRef.current + project(velocity);
    const shouldDismiss = projectedEnd > height * 0.4;

    if (shouldDismiss) {
      requestDismiss(velocity);
    } else {
      // Snapping home after a throw is a momentum interaction, so a little
      // overshoot is right here where it would be wrong on a plain fade-in.
      animateTo(0, velocity, SPRING_SHEET);
    }
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label={label}>
      {/* Scrim. A modal task dims what is behind it; its opacity is driven by
          the drag, not by a fixed transition. */}
      <div
        ref={scrimRef}
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        style={{ opacity: 0 }}
        aria-hidden="true"
      />

      <div
        ref={sheetRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="material material-thick material-edge-top absolute bottom-0 left-0 right-0 rounded-t-2xl pb-[env(safe-area-inset-bottom)] touch-none will-change-transform"
        style={{ transform: "translate3d(0, 100%, 0)" }}
      >
        {/* Grab handle. The affordance that says this surface is draggable. */}
        <div className="flex justify-center pt-3 pb-1">
          <span className="h-1 w-9 rounded-full bg-text-tertiary/40" aria-hidden="true" />
        </div>
        {children}
      </div>
    </div>
  );
}
