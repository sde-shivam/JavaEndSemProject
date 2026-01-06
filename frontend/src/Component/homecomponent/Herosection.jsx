import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative w-full h-[90vh] poppins bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1600&auto=format&fit=crop')",
      }}
    >
      {/* Minimalist Dark Overlay */}
      <div className="absolute inset-0 bg-[#0d1117]/75"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-white text-5xl md:text-6xl font-bold leading-tight mb-4"
        >
          Smarter Billing for Modern Businesses
        </motion.h1>

        {/* Short Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-slate-300 text-lg md:text-xl max-w-2xl mb-10"
        >
          Automate invoices, track payments, and simplify your daily operations
          with a clean, fast, and intuitive billing system.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link to="/signup">
            <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-md font-medium transition w-fit shadow-lg shadow-green-500/20">
              Get Started
            </button>
          </Link>
        </motion.div>

        {/* Info Blocks - Stagger Animation */}
        <motion.div
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >
          {[
            {
              title: "Fast Setup",
              desc: "Create bills and manage customers in minutes.",
            },
            {
              title: "Easy Tracking",
              desc: "Track payments and dues without any complexity.",
            },
            {
              title: "Secure Data",
              desc: "Your business data stays encrypted and safe.",
            },
          ].map((block, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6 }}
              className="text-slate-300"
            >
              <h3 className="text-white text-xl font-semibold mb-1">
                {block.title}
              </h3>
              <p className="text-sm text-slate-400">{block.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
