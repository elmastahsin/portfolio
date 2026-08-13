import { prefersReducedMotion } from "./spring";

/** Height of the fixed navbar; anchors land below it rather than under it. */
const NAV_OFFSET = 80;

/**
 * Scroll to a section. Smooth scrolling is a large moving field of view, so it
 * is exactly the kind of motion `prefers-reduced-motion` is about - jump
 * instead when the user asked for that.
 */
export function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (!element) return;

  const top = element.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  window.scrollTo({
    top,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}
