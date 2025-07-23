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
            src="/images/wedding-elegant.png"
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
              <div className="text-center">
                <div className="text-[96px] text-[#F0E9E1] font-extrabold leading-none tracking-[-0.48px]">
                  Ateliê
                </div>
                <div className="text-[31px] text-[#F0E9E1] font-light tracking-[10.625px] uppercase">
                  DE CRIANÇA
                </div>
              </div>
            </div>
          </motion.h1>

          {/* <motion.p
            className="text-xl md:text-2xl mb-8 text-gray-200"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Transforme os seus eventos em momentos inesquecíveis
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              size="lg"
              className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 text-lg"
            >
              Reserve o seu evento
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg bg-transparent"
            >
              Veja os nossos trabalhos
            </Button>
          </motion.div> */}
        </div>

        {/* <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
          >
            <motion.div
              className="w-1 h-3 bg-white rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </motion.div>
        </motion.div> */}
      </section>
    </>
  );
};

export { HeroSection };
