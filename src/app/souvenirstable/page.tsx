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
    { id: 1, src: getImage('mesa_01'), colSpan: "md:col-span-2" },
    { id: 2, src: getImage('mesa_02') },
    { id: 3, src: getImage('mesa_03') },
    { id: 4, src: getImage('mesa_04'), colSpan: "md:col-span-2" },
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
              <div className="ml-auto w-full ">
                <div className=" relative md:h-[700px] flex items-center justify-center">
                  <Image
                    width={1200}
                    height={500}
                    src="/images/table-cover-snack.png"
                    alt="Espaço infantil com piscina de bolinhas e brinquedos educativos"
                    className="mission-image"
                  />
                </div>
              </div>

              <div className=" grid grid-cols-1 gap-2 p-2 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 sm:p-4">
                {mockImages.map((img) => (
                  <div
                    key={img.id}
                    className={`flex items-center justify-center min-h-auto md:h-[300px] overflow-hidden ${
                      img.colSpan
                    }`}
                  >
                    <Image src={img.src} alt={`Imagem ${img.id}`} className="mission-image" />
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
