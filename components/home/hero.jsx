"use client";

import React, { useEffect, useState } from "react";
import { AnimatedText } from "../text-transformation/animated-text";
import Link from "next/link";
import { Button } from "../ui/button";

const HeroSection = () => {
  const [textVisible, setTextVisible] = useState(false);
  const [demoHovered, setDemoHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTextVisible(true), 500); // Delay of 500ms before showing the text
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="text-center z-10 px-6">
        <div
          className={`transition-all duration-1000 ${textVisible ? "opacity-100 translate-y-0 transition-transform duration-1000" : "opacity-0 -translate-y-20 transition-transform"} `}
        >
          <h1 className="text-6xl md:text-9xl font-extrabold mb-6 leading-tight ">
            <span className="bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text">
              Create
            </span>
            <br />
            
            <span style={{ textShadow: "3px 3px 6px rgba(0,0,0,0.8)" }}>
              With Ease
            </span>
          </h1>

          <AnimatedText
            text="AI-driven image editing for professionals. Precise cropping, resizing, color correction, background removal, and image enhancement"
            className="mb-8 text-gray-400 max-w-3xl mx-auto text-xl leading-relaxed"
            speed={50}
          />
          <div className="flex flex-col sm:flex-row justify-center gap-6 items-center mb-12">
            <Link href="/dashboard">
                <Button variant="primary" size="xl">Start Creating</Button>
            </Link>
            <Link href="/#">
                <Button variant="glass" size={"xl"}>Watch Demo</Button>
            </Link>
          </div>
        </div>
        {/* demo interface */}
      </div>
    </section>
  );
};

export default HeroSection;
