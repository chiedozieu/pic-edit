import FeaturesSection from "@/components/home/features";
import HeroSection from "@/components/home/hero";
import Pricing from "@/components/home/pricing";
import { Button } from "@/components/ui/button";
import { Stars } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="pt-12">
      {/* Hero */}
      <HeroSection />
      {/* features */}
      <FeaturesSection />
      {/* pricing */}
      <Pricing />
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-bold mb-4 ">
            Ready to <span className="bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text">Make awesome creations?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the creative revolution with AI-powered image editing.
            Limitless possibilities, endless creativity.
          </p>
          <Link href="/dashboard">
            <Button variant="primary" size="xl" className="">
            <Stars className="animate-pulse text-yellow-400 transition-all duration-300" />
              Start Creating
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
