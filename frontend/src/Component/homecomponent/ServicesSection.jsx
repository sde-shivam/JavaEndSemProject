import React from "react";
import { motion } from "framer-motion";

// JSON DATA — add as many as you want
const servicesData = [
  {
    id: 1,
    title: "Smart POS integration",
    desc: "Seamless integration for your business.",
    img: "https://images.unsplash.com/photo-1610461853808-0c0bf780a7c6?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Inventory management solutions",
    desc: "Optimize stock levels effortlessly.",
    img: "https://images.unsplash.com/photo-1724709162875-fe100dd0e04b?q=80&w=1171&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Customer relationship management",
    desc: "Build lasting connections with clients.",
    img: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Advanced analytics dashboard",
    desc: "Gain insights with real-time analytics.",
    img: "https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=1200&auto=format&fit=crop",
  },
];

// Framer Motion Variants
const containerVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.15, duration: 0.6 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="w-full h-[95vh] flex items-center bg-[#eef0f2] px-6 poppins overflow-hidden"
    >
      <motion.div
        className="max-w-7xl mx-auto w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* LABEL */}
        <motion.p
          className="text-green-600 font-semibold uppercase tracking-wide text-sm mb-2"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Streamlined POS Solutions
        </motion.p>

        {/* TITLE */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Empower your business with ease
        </motion.h2>

        {/* DYNAMIC GRID */}
        <motion.div
          variants={containerVariant}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {servicesData.map((service) => (
            <motion.div
              key={service.id}
              variants={cardVariant}
              whileHover={{
                scale: 1.05,
                y: -6,
                transition: { duration: 0.2 },
              }}
              className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer"
            >
              <img
                src={service.img}
                alt={service.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-1">
                  {service.title} <span className="text-gray-500">›</span>
                </h3>
                <p className="text-gray-600 text-sm">{service.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
