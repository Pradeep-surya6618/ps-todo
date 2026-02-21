"use client";

import { useEffect } from "react";

export default function BodyScrollLock() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const originals = {
      htmlOverscroll: html.style.overscrollBehavior,
      bodyOverscroll: body.style.overscrollBehavior,
      htmlHeight: html.style.height,
      bodyHeight: body.style.height,
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
    };

    // Prevent pull-to-refresh / overscroll bounce.
    html.style.overscrollBehavior = "none";
    body.style.overscrollBehavior = "none";

    // Lock document height and prevent body scroll.
    // Inner containers handle their own scrolling via overflow-y-auto.
    html.style.height = "100%";
    body.style.height = "100%";
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overscrollBehavior = originals.htmlOverscroll;
      body.style.overscrollBehavior = originals.bodyOverscroll;
      html.style.height = originals.htmlHeight;
      body.style.height = originals.bodyHeight;
      html.style.overflow = originals.htmlOverflow;
      body.style.overflow = originals.bodyOverflow;
    };
  }, []);

  return null;
}
