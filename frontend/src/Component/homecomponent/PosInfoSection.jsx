import React from "react";
import { motion } from "framer-motion";

export default function PosInfoSection() {
  return (
    <section
      id="about"
      className="w-full h-[90vh] flex items-center px-6 bg-[#f9fafb] poppins overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          className="pr-4"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {/* SMALL LABEL */}
          <motion.div
            className="flex items-center gap-3 mb-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="w-10 h-[2px] bg-green-600"></div>
            <p className="text-green-600 font-semibold text-sm tracking-wide uppercase">
              Revolutionizing Payments
            </p>
          </motion.div>

          {/* TITLE */}
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Your POS solution awaits
          </motion.h2>

          {/* DESCRIPTION 1 */}
          <motion.p
            className="text-gray-600 text-lg leading-relaxed mb-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Quick Bills transforms how businesses manage transactions with our
            state-of-the-art POS systems. Designed for efficiency and ease of
            use, our solutions empower retailers, restaurants, and service
            providers to streamline operations, enhance customer experiences,
            and boost sales.
          </motion.p>

          {/* DESCRIPTION 2 */}
          <motion.p
            className="text-gray-600 text-lg leading-relaxed mb-8"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            viewport={{ once: true }}
          >
            With robust analytics and support, we ensure your business stays
            ahead in a competitive market. Choose Quick Bills for a seamless
            payment experience that drives growth and efficiency.
          </motion.p>

          {/* CTA */}
          <motion.a
            href="#contact"
            className="text-green-600 text-lg font-medium hover:underline"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Get in touch →
          </motion.a>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          className="flex justify-center md:justify-end"
          initial={{ opacity: 0, scale: 0.9, x: 60 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="rounded-xl overflow-hidden shadow-lg max-w-lg w-full">
            <img
              src="https://images.unsplash.com/photo-1610461853808-0c0bf780a7c6?q=80&w=1193&auto=format&fit=crop"
              alt="POS Machine"
              className="w-full object-cover"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
