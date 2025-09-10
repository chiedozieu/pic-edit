"use client";

import { useParallax } from "@/hooks/use-parallax";
import React from "react";

const FloatingShapes = () => {
  const scrollY = useParallax();
  const shapes = [
    {
      id: 1,
      size: "size-72",
      position: "top-20 left-10",
      // gradient: "from-blue-500 to purple-600",
      gradient: "from-pink-500 via-red-500 to-yellow-500",
    },

    {
      id: 2,
      size: "size-96",
      position: "top-1/3 right-10",
      // gradient: "from-cyan-400 to blue-500",
      gradient: "from-red-500 to-orange-500",
    },
    {
      id: 3,
      size: "size-64",
      position: "bottom-20 left-1/4",
      // gradient: "from-purple-500 to pink-500",
      gradient: "from-yellow-700 via-red-600 to-pink-500",
    },
    {
      id: 4,
      size: "size-80",
      position: "bottom-1/3 right-1/4",
      // gradient: "from-green-400 to cyan-500",
      gradient: "from-purple-500 via-pink-500 to-red-500",
    },
  ];
  return (
    <div>
      {shapes.map((shape) => {
        return (
          <div
          key={shape.id}
            className={`absolute transition-all duration-300 ${shape.position} bg-gradient-to-r ${shape.gradient} rounded-full blur-3xl opacity-20 animate-pulse ${shape.size}`}
            style={{ transform: `translateY(${scrollY * 0.5}px) rotate(${scrollY * 0.1}deg)` }}
          />
        );
      })}
    </div>
  );
};

export default FloatingShapes;
