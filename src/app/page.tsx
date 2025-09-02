"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { LoadingSpinner } from "@/components/atoms";

import { HeroSection } from "@/components/modules";
import { useProducts } from "@/hooks/use-products";
import { CartSheet } from "@/components/modules/cart";

export default function Component() {
  const [isLoading, setIsLoading] = useState(true);
  const { isCartOpen, setIsCartOpen } = useProducts();

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
          <HeroSection />
        </motion.main>
      )}
      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </AnimatePresence>
  );
}
