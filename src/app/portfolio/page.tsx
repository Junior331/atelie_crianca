"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Footer } from "@/components/modules";
import { Header } from "@/components/organisms";
import { LoadingSpinner } from "@/components/atoms";

const portfolioCategories = [
  { name: "TODOS", value: "all" },
  { name: "CASAMENTOS", value: "weddings" },
  { name: "EVENTOS CORPORATIVOS", value: "corporate" },
  { name: "ANIVERSÁRIOS", value: "birthdays" },
];

const portfolioItems = [
  {
    id: "1",
    title: "RECEPÇÃO DE CASAMENTO",
    subtitle: "Elegante celebração noturna",
    category: "weddings",
    image: "/images/wedding-elegant.png",
  },
  {
    id: "2",
    title: "JANTAR DE GALA CORPORATIVO",
    subtitle: "Gala anual da empresa",
    category: "corporate",
    image: "/images/corporate-event.png",
  },
  {
    id: "3",
    title: "CASAMENTO AO AR LIVRE",
    subtitle: "Preparação da cerimónia no jardim",
    category: "weddings",
    image: "/images/outdoor-wedding-ceremony.jpg",
  },
  {
    id: "4",
    title: "FESTA DE ANIVERSÁRIO",
    subtitle: "Celebração doce",
    category: "birthdays",
    image: "/images/birthday-party-pink.jpg",
  },
];

export default function Component() {
  const [isLoading, setIsLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState("all");

  const filteredItems =
    activeCategory === "all"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <LoadingSpinner key="loading" />
      ) : (
        <motion.main
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen"
        >
          <Header />
          <div className="py-10 bg-background">
            <div className="container mx-auto px-4">
              <motion.div
                className="text-center mb-16"
                transition={{ duration: 0.8 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-5xl md:text-6xl font-light text-black mb-12 tracking-wider">
                  PORTFOLIO
                </h2>

                <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                  {portfolioCategories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => setActiveCategory(category.value)}
                      className={`cursor-pointer text-sm md:text-base font-medium tracking-wider transition-all duration-300 pb-2 border-b-2 ${
                        activeCategory === category.value
                          ? "text-rose-500 border-rose-500"
                          : "text-gray-500 border-transparent hover:text-gray-700"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Portfolio Grid */}
              <motion.div
                layout
                className="grid md:grid-cols-2 gap-8 md:gap-12"
              >
                {filteredItems.map((item, index) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group cursor-pointer bg-[#efe5ea] rounded-lg pb-6"
                  >
                    <div className="relative h-80 md:h-96 overflow-hidden rounded-t-lg mb-6 bg-gray-100">
                      {item.image ? (
                        <div className="relative h-full overflow-hidden">
                          <Image
                            fill
                            alt={item.title}
                            src={item.image || "/placeholder.svg"}
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                          <div className="text-6xl opacity-20">📸</div>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="text-center">
                      <h3
                        className="text-xl md:text-2xl font-light text-gray-800 mb-2 tracking-wider"
                        style={{
                          fontFamily: 'Georgia, "Times New Roman", serif',
                        }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm md:text-base font-light">
                        {item.subtitle}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
          <Footer />
        </motion.main>
      )}
    </AnimatePresence>
  );
}
