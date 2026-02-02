"use client";

import { useEffect } from "react";

export default function BodyScrollLock() {
  useEffect(() => {
    // Lock both html and body scroll
    const html = document.documentElement;
    const body = document.body;

    const originalHtmlStyle = html.style.cssText;
    const originalBodyStyle = body.style.cssText;

    // Aggressive pinning
    html.style.height = "100%";
    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";

    body.style.height = "100%";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    body.style.position = "fixed";
    body.style.width = "100%";
    body.style.touchAction = "none";

    return () => {
      // Restore styles
      html.style.cssText = originalHtmlStyle;
      body.style.cssText = originalBodyStyle;
    };
  }, []);

  return null;
}
