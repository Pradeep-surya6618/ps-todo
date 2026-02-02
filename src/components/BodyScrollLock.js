"use client";

import { useEffect } from "react";

export default function BodyScrollLock() {
  useEffect(() => {
    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    const originalHeight = document.body.style.height;
    const originalPosition = document.body.style.position;

    document.body.style.overflow = "hidden";
    document.body.style.height = "100dvh";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";

    return () => {
      // Restore body scroll
      document.body.style.overflow = originalOverflow;
      document.body.style.height = originalHeight;
      document.body.style.position = originalPosition;
      document.body.style.width = "";
    };
  }, []);

  return null;
}
