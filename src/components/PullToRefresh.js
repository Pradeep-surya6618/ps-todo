"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

export default function PullToRefresh() {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canPull, setCanPull] = useState(false);
  const touchStartY = useRef(0);
  const containerRef = useRef(null);
  const router = useRouter();

  const PULL_THRESHOLD = 80; // Distance to trigger refresh
  const MAX_PULL = 120; // Maximum pull distance

  useEffect(() => {
    const handleTouchStart = (e) => {
      // Only allow pull-to-refresh when at the top of the page
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop === 0) {
        touchStartY.current = e.touches[0].clientY;
        setCanPull(true);
      } else {
        setCanPull(false);
      }
    };

    const handleTouchMove = (e) => {
      if (!canPull || isRefreshing) return;

      const touchY = e.touches[0].clientY;
      const distance = touchY - touchStartY.current;

      // Only pull down, not up
      if (distance > 0) {
        // Prevent default scrolling when pulling
        if (distance > 10) {
          e.preventDefault();
        }

        // Apply resistance curve for smoother feel
        const resistanceFactor = 0.5;
        const adjustedDistance = Math.min(
          distance * resistanceFactor,
          MAX_PULL,
        );
        setPullDistance(adjustedDistance);
      }
    };

    const handleTouchEnd = () => {
      if (!canPull || isRefreshing) {
        setPullDistance(0);
        return;
      }

      if (pullDistance >= PULL_THRESHOLD) {
        setIsRefreshing(true);
        // Trigger page refresh
        setTimeout(() => {
          router.refresh();
          window.location.reload();
        }, 300);
      } else {
        setPullDistance(0);
      }
      setCanPull(false);
    };

    // Add event listeners with passive: false to allow preventDefault
    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [canPull, pullDistance, isRefreshing, router]);

  const progress = Math.min((pullDistance / PULL_THRESHOLD) * 100, 100);
  const rotation = (pullDistance / MAX_PULL) * 360;

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center pointer-events-none"
      style={{
        height: `${pullDistance}px`,
        transition:
          isRefreshing || pullDistance === 0 ? "height 0.3s ease-out" : "none",
      }}
    >
      <div
        className="relative flex items-center justify-center"
        style={{
          opacity: pullDistance > 0 ? 1 : 0,
          transform: `scale(${Math.min(pullDistance / PULL_THRESHOLD, 1)})`,
          transition:
            pullDistance === 0
              ? "opacity 0.3s ease-out, transform 0.3s ease-out"
              : "none",
        }}
      >
        {/* Circular progress background */}
        <svg
          className="absolute"
          width="48"
          height="48"
          viewBox="0 0 48 48"
          style={{
            transform: "rotate(-90deg)",
          }}
        >
          {/* Background circle */}
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-primary/20"
          />
          {/* Progress circle */}
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${2 * Math.PI * 20}`}
            strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
            strokeLinecap="round"
            className="text-primary transition-all duration-150"
          />
        </svg>

        {/* Refresh icon */}
        <RefreshCw
          size={24}
          className="text-primary"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isRefreshing ? "none" : "transform 0.1s ease-out",
          }}
        />
      </div>

      {/* Pull hint text */}
      {pullDistance > 10 && pullDistance < PULL_THRESHOLD && (
        <div
          className="absolute top-full mt-2 text-sm font-medium text-primary/70"
          style={{
            opacity: Math.min(pullDistance / 40, 1),
          }}
        >
          Pull to refresh
        </div>
      )}

      {/* Release hint text */}
      {pullDistance >= PULL_THRESHOLD && !isRefreshing && (
        <div className="absolute top-full mt-2 text-sm font-bold text-primary animate-pulse">
          Release to refresh
        </div>
      )}
    </div>
  );
}
