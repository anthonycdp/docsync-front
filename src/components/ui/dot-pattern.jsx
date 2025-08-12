"use client";

import { cn } from "../../lib/utils";
import React, { useEffect, useId, useRef, useState } from "react";

/**
 * DotPattern Component
 *
 * A React component that creates a static dot pattern background using SVG.
 * The pattern automatically adjusts to fill its container.
 *
 * @param {Object} props - Component props
 * @param {number} [props.width=16] - The horizontal spacing between dots
 * @param {number} [props.height=16] - The vertical spacing between dots  
 * @param {number} [props.x=0] - The x-offset of the entire pattern
 * @param {number} [props.y=0] - The y-offset of the entire pattern
 * @param {number} [props.cx=1] - The x-offset of individual dots
 * @param {number} [props.cy=1] - The y-offset of individual dots
 * @param {number} [props.cr=1] - The radius of each dot
 * @param {string} [props.className] - Additional CSS classes to apply to the SVG container
 */

export function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  ...props
}) {
  const id = useId();
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const dots = Array.from(
    {
      length:
        Math.ceil(dimensions.width / width) *
        Math.ceil(dimensions.height / height),
    },
    (_, i) => {
      const col = i % Math.ceil(dimensions.width / width);
      const row = Math.floor(i / Math.ceil(dimensions.width / width));
      return {
        x: col * width + cx,
        y: row * height + cy,
      };
    },
  );

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className,
      )}
      {...props}
    >
      {dots.map((dot, index) => (
        <circle
          key={`${dot.x}-${dot.y}`}
          cx={dot.x}
          cy={dot.y}
          r={cr}
          fill="currentColor"
          className="text-gray-200/40"
        />
      ))}
    </svg>
  );
}