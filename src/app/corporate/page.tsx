"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { Header } from "@/components/organisms";
import { LoadingSpinner } from "@/components/atoms";
import { Footer } from "@/components/modules";
import { getImage } from "@/assets/images";

const corporateImages = [
  { id: 1, src: "/images/corporativo/foto-1.jpg", colSpan: "md:col-span-2" },
  { id: 2, src: "/images/corporativo/foto-2.jpg" },
  { id: 3, src: "/images/corporativo/foto-3.jpg" },
  { id: 4, src: "/images/corporativo/foto-4.jpg", colSpan: "md:col-span-2" },
  { id: 5, src: "/images/corporativo/foto-5.jpg", colSpan: "md:col-span-2" },
  { id: 6, src: "/images/corporativo/foto-6.jpg" },
];

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
          <section className="relative min-h-screen flex flex-col">
              {/* Banner */}
              <div className="ml-auto w-full ">
              <div className="relative w-full h-auto max-h-[640px] flex items-center justify-center">
                  <Image
                    width={1200}
                    height={500}
                    src={getImage("capa_corporativo")}
                    alt="capa corporativo"
                    className="mission-image"
                  />
                </div>

              <div className=" grid grid-cols-1 gap-2 p-2 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 sm:p-4">
                {corporateImages.map((img) => (
                  <div
                    key={img.id}
                    className={`flex items-center justify-center min-h-auto md:h-[300px] overflow-hidden ${img.colSpan}`}
                  >
                    <Image
                      width={1200}
                      height={500}
                      src={img.src}
                      alt={`Imagem ${img.id}`}
                      className="mission-image"
                    />
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
