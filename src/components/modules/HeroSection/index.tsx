"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// import { Button } from "@/components/atoms";
import { Header } from "@/components/organisms";

const HeroSection = () => {
  return (
    <>
      <Header isSecundary={false} />
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/banner_02.png"
            alt="Elegant wedding setup"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto pt-16">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6"
            style={{
              fontFamily:
                'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center justify-center">
              <Image
                width={1000}
                height={1000}
                alt="Ateliê de Criança"
                src="/images/logo_light.png"
                className="size-96 object-contain"
              />
            </div>
          </motion.h1>
        </div>
      </section>
    </>
  );
};

export { HeroSection };
