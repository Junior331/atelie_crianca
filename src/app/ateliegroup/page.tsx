"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { Header } from "@/components/organisms";
import { LoadingSpinner } from "@/components/atoms";
import { Footer } from "@/components/modules";
import { getImage } from "@/assets/images";
import { getProduto } from "@/assets/Produtos";

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
            <div className="">
              <div className="ml-auto w-full">
              <div className="relative w-full h-auto max-h-[640px] flex items-center justify-center">
                  <Image
                    src={getImage("capa_grupo")}
                    alt="Conheça o grupo Ateliê de Criança"
                    className="mission-image"
                  />
                </div>
              </div>

              {/* Grid de serviços */}
              <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Linha 1 - Ateliê */}
                  <div className="flex items-center justify-center">
                    <Image
                      src="/images/logo-atelie.png"
                      alt="Ateliê de Criança"
                      width={150}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                  <div className="aspect-square relative">
                    <Image
                      src="/images/atelie-1.jpeg"
                      alt="Ateliê serviço 1"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-square relative">
                    <Image
                      src="/images/atelie-2.jpeg"
                      alt="Ateliê serviço 2"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-square relative">
                    <Image
                      src="/images/atelie-3.jpeg"
                      alt="Ateliê serviço 3"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Linha 2 - Casamentos */}
                  <div className="flex items-center justify-center">
                    <Image
                      src="/images/logo-casamentos.png"
                      alt="Ateliê de Criança Casamentos"
                      width={150}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                  <div className="aspect-square relative">
                    <Image
                      src="/images/casamentos-1.jpeg"
                      alt="Casamentos serviço 1"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-square relative">
                    <Image
                      src="/images/casamentos-2.jpeg"
                      alt="Casamentos serviço 2"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-square relative">
                    <Image
                      src="/images/casamentos-3.jpeg"
                      alt="Casamentos serviço 3"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Linha 3 - Produtos */}
                  <div className="flex items-center justify-center">
                    <Image
                      src="/images/logo-produtos.png"
                      alt="Ateliê de Criança Produtos"
                      width={150}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                  <div className="aspect-square relative">
                    <Image
                      src={getProduto("fantasias", "capa_de_princesa")}
                      alt="Produtos 1"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-square relative">
                    <Image
                      src={getProduto("fantasias", "mascara")}
                      alt="Produtos 2"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-square relative">
                    <Image
                      src={getProduto('fantasias', 'fantasia_de_policial')}
                      alt="Produtos 3"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Linha 4 - Brinquedoteca */}
                  <div className="flex items-center justify-center">
                    <Image
                      src="/images/logo-brinquedoteca.png"
                      alt="Brinquedoteca"
                      width={150}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                  <div className="aspect-square relative">
                    <Image
                      src="/images/brinquedoteca-1.jpeg"
                      alt="Brinquedoteca 1"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-square relative">
                    <Image
                      src="/images/brinquedoteca-2.jpeg"
                      alt="Brinquedoteca 2"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-square relative">
                    <Image
                      src="/images/brinquedoteca-3.jpeg"
                      alt="Brinquedoteca 3"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
