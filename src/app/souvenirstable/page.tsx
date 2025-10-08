"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Header } from "@/components/organisms";
import { LoadingSpinner } from "@/components/atoms";
import { Footer } from "@/components/modules";
import Image from "next/image";
import { getImage } from "@/assets/images";

export default function Component() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const mockImages = [
    { id: 1, src: getImage('mesa_01'), colSpan: "col-span-2" },
    { id: 2, src: getImage('mesa_02') },
    { id: 3, src: getImage('mesa_03') },
    { id: 4, src: getImage('mesa_04'), colSpan: "col-span-2" },
    { id: 5, src: getImage('mesa_05'), colSpan: "md:col-span-2" },
    { id: 6, src: getImage('mesa_05') },
  ];

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
          <section className="relative min-h-screen flex flex-col">
            <div className="">
              <div className="ml-auto w-full p-6">
                <div className=" relative h-[700px] flex items-center justify-center">
                  {/* Imagem de fundo */}
                  <Image
                    width={1200}
                    height={500}
                    src="/images/table-cover-snack.png"
                    alt="Espaço infantil com piscina de bolinhas e brinquedos educativos"
                    className="mission-image"
                  />
                </div>
              </div>

              <div className=" grid grid-cols-2 md:grid-cols-3 gap-4 p-6">
                {mockImages.map((img) => (
                  <div
                    key={img.id}
                    className={`bg-red-500 relative flex items-center justify-center h-[300px]  overflow-hidden ${
                      img.colSpan || ""
                    }`}
                  >
                    <Image src={img.src} alt={`Imagem ${img.id}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </section>
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
