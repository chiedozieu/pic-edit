import { PricingTable } from "@clerk/nextjs";
import React from "react";

const Pricing = () => {
  return (
    <section>
      <div className="py-20">
        <div className="text-center mb-16">
        
          <h2 className="text-5xl font-bold  pb-6">
          Simple
            <span className="bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text"> Pricing</span>
          </h2>
          <p className="text-xl text-gray-300 ">
           Try for free, upgrade as needed. No hidden costs, cancel anytime.
          </p>
        </div>
      <div className="max-w-4xl mx-auto p-12">
          <PricingTable />
      </div>
      </div>
    </section>
  );
};

export default Pricing;
