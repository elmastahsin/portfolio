/**
 * A spring driver, parameterised the way Apple parameterises them: damping ratio
 * and response, not mass/stiffness/damping.
 *
 *   dampingRatio  1.0  = critically damped, settles without overshoot
 *                 <1.0 = overshoots and oscillates; lower is bouncier
 *   response      seconds to substantially reach the target. NOT a duration -
 *                 a spring has no fixed duration, its settle time emerges.
 *
 * Why this exists rather than a CSS transition: a transition cannot be grabbed
 * and reversed mid-flight without a visible jump, because it has no notion of
 * the current velocity. Every animation here starts from the presentation
 * value and the live velocity, so retargeting mid-flight is seamless.
 */

export interface SpringConfig {
  dampingRatio: number;
  response: number;
}

/** Move / reposition. No overshoot - the default for anything not thrown. */
export const SPRING_SETTLE: SpringConfig = { dampingRatio: 1.0, response: 0.4 };
/** Drawers and sheets. A little bounce, because a drag preceded it. */
export const SPRING_SHEET: SpringConfig = { dampingRatio: 0.8, response: 0.3 };

/**
 * Apple's momentum projection (from the Designing Fluid Interfaces sample code).
 * Predicts where a flick would come to rest, so we can snap to the target
 * nearest the *projected* endpoint rather than the release point. This is what
 * makes a flick feel like it throws the element.
 *
 * Note this is exponential decay, not the textbook v^2/(2a).
 */
export function project(initialVelocity: number, decelerationRate = 0.998): number {
  return ((initialVelocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/**
 * Progressive resistance past a boundary. A hard stop reads as "frozen"; falling
 * resistance reads as "responsive, but there is nothing more here".
 */
export function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

interface SpringState {
  value: number;
  velocity: number;
}

/**
 * Closed-form position and velocity of a damped harmonic oscillator at time t.
 * Solved analytically rather than integrated step-by-step so that long
 * animations do not accumulate error and a frame drop cannot change the path.
 */
function evaluate(
  t: number,
  from: number,
  velocity: number,
  to: number,
  { dampingRatio, response }: SpringConfig
): SpringState {
  const omega = (2 * Math.PI) / response;
  const displacement = from - to;

  if (dampingRatio < 1) {
    const omegaDamped = omega * Math.sqrt(1 - dampingRatio * dampingRatio);
    const decay = Math.exp(-dampingRatio * omega * t);
    const c1 = displacement;
    const c2 = (velocity + dampingRatio * omega * displacement) / omegaDamped;
    const cos = Math.cos(omegaDamped * t);
    const sin = Math.sin(omegaDamped * t);

    return {
      value: to + decay * (c1 * cos + c2 * sin),
      velocity:
        decay *
        ((c2 * omegaDamped - c1 * dampingRatio * omega) * cos -
          (c1 * omegaDamped + c2 * dampingRatio * omega) * sin),
    };
  }

  // Critically damped (and, close enough, overdamped).
  const decay = Math.exp(-omega * t);
  const c2 = velocity + omega * displacement;

  return {
    value: to + decay * (displacement + c2 * t),
    velocity: decay * (c2 - omega * (displacement + c2 * t)),
  };
}

export interface SpringHandle {
  /** Retarget mid-flight. Carries the live velocity through, so a reversal has
   *  no velocity discontinuity - no "brick wall". */
  setTarget(to: number, velocity?: number): void;
  /** Stop and report where it actually is right now. */
  stop(): SpringState;
  readonly value: number;
  readonly velocity: number;
}

/**
 * Drives one scalar. Decompose 2D motion into two of these - a single spring on
 * a 2D distance desyncs as soon as X and Y have different velocities.
 */
export function spring(
  from: number,
  to: number,
  config: SpringConfig,
  onFrame: (value: number, velocity: number) => void,
  onSettle?: () => void,
  initialVelocity = 0
): SpringHandle {
  let origin = from;
  let target = to;
  let velocity = initialVelocity;
  let current = from;
  let startTime = 0;
  let frame = 0;

  const settled = (state: SpringState) =>
    Math.abs(state.value - target) < 0.4 && Math.abs(state.velocity) < 8;

  const tick = (now: number) => {
    if (!startTime) startTime = now;
    const elapsed = (now - startTime) / 1000;
    const state = evaluate(elapsed, origin, velocity, target, config);
    current = state.value;

    if (settled(state)) {
      current = target;
      onFrame(target, 0);
      frame = 0;
      onSettle?.();
      return;
    }

    onFrame(state.value, state.velocity);
    frame = requestAnimationFrame(tick);
  };

  frame = requestAnimationFrame(tick);

  const liveState = (now: number): SpringState => {
    if (!startTime) return { value: origin, velocity };
    return evaluate((now - startTime) / 1000, origin, velocity, target, config);
  };

  return {
    setTarget(next, nextVelocity) {
      // Restart from the presentation value and the velocity we already have.
      // Starting from the logical target instead is what causes a visible jump.
      const state = liveState(performance.now());
      origin = state.value;
      velocity = nextVelocity ?? state.velocity;
      target = next;
      startTime = 0;
      if (!frame) frame = requestAnimationFrame(tick);
    },
    stop() {
      const state = liveState(performance.now());
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      current = state.value;
      return state;
    },
    get value() {
      return current;
    },
    get velocity() {
      return velocity;
    },
  };
}

/** Rolling sample window, so release velocity comes from the last few moves
 *  rather than a single noisy frame delta. */
export class VelocityTracker {
  private samples: { value: number; time: number }[] = [];

  add(value: number, time = performance.now()) {
    this.samples.push({ value, time });
    // ~100ms of history is enough to be stable without lagging a direction change.
    while (this.samples.length > 2 && time - this.samples[0].time > 100) {
      this.samples.shift();
    }
  }

  /** px per second. */
  get velocity(): number {
    if (this.samples.length < 2) return 0;
    const first = this.samples[0];
    const last = this.samples[this.samples.length - 1];
    const dt = last.time - first.time;
    if (dt <= 0) return 0;
    return ((last.value - first.value) / dt) * 1000;
  }

  reset() {
    this.samples = [];
  }
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
