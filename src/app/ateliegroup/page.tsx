"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Header } from "@/components/organisms";
import { LoadingSpinner } from "@/components/atoms";
import { Footer } from "@/components/modules";

export default function Component() {
  const [isLoading, setIsLoading] = useState(true);

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
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col min-h-screen"
        >
          <Header />
          <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
            <h2 className="text-4xl font-bold text-gray-700 mb-4">Em breve</h2>
            <p className="text-lg text-gray-500">
              Estamos preparando algo incrível para você!
            </p>
          </div>
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
