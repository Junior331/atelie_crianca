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

  // if (error) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold text-red-500">
  //           Erro ao carregar produtos
  //         </h2>
  //         <p className="text-gray-600">{error}</p>
  //         <button
  //           onClick={() => fetchProducts()}
  //           className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  //         >
  //           Tentar novamente
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

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
          {/* <RentalCollection /> */}
          {/* <ServicesSection />
        <BookingSection />
        <Footer /> */}
        </motion.main>
      )}
      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </AnimatePresence>
    // <div className="min-h-screen bg-[#ffffff]">
    //   <Header setIsCartOpen={setIsCartOpen} />

    //   {/* Products Section */}
    //   <main className="md:max-w-5/6 mx-auto px-4 py-5">
    //     <section className="relative h-[400px] overflow-hidden">
    //       <Image
    //         fill
    //         src={getImage("banner_home")}
    //         alt="Ateliê de Criança Workshop"
    //       />
    //       <div className="absolute inset-0 bg-black/40" />
    //       <div className="absolute inset-0 flex items-center justify-center">
    //         <div className="text-center">
    //           <h1 className="text-[96px] text-[#F0E9E1] font-extrabold leading-none tracking-[-0.48px]">
    //             Ateliê
    //           </h1>
    //           <p className="text-[31px] text-[#F0E9E1] font-light tracking-[10.625px] uppercase">
    //             DE CRIANÇA
    //           </p>
    //         </div>
    //       </div>
    //     </section>

    //     <div className="mb-2 mt-4">
    //       <p className="text-sm text-[#787885]">
    //         <span className="font-semibold text-[#000000]">
    //           {loading ? "--" : filteredProducts.length}
    //         </span>{" "}
    //         resultados
    //       </p>
    //     </div>

    //     {/* Product Grid */}
    //     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
    //       {loading ? (
    //         <div className="flex justify-center items-center h-screen">
    //           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    //         </div>
    //       ) : (
    //         filteredProducts.map((product) => (
    //           <Card
    //             key={product.id}
    //             className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-2 border-transparent hover:border-pink-200 flex flex-col h-full"
    //           >
    //             <CardHeader className="p-0">
    //               <div className="relative overflow-hidden rounded-t-lg">
    //                 <Image
    //                   width={300}
    //                   height={200}
    //                   alt={product.name}
    //                   src={product.image || getImage("fallback")}
    //                   className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
    //                 />
    //                 <div className="flex flex-wrap gap-1.5 absolute top-3 left-3">
    //                   <Badge
    //                     className={`${
    //                       getCategoryInfo(product.category).color
    //                     } text-white`}
    //                   >
    //                     {product.category}
    //                   </Badge>
    //                 </div>
    //               </div>
    //             </CardHeader>

    //             <CardContent className="flex-grow">
    //               <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-pink-600 transition-colors">
    //                 {product.name}
    //               </h3>
    //               <p className="text-gray-600 text-sm mb-3 line-clamp-2">
    //                 {product.description}
    //               </p>

    //               {product.highlights && product.highlights.length > 0 && (
    //                 <div className="mb-3">
    //                   <div className="flex flex-wrap gap-1">
    //                     {product.highlights
    //                       .slice(0, 2)
    //                       .map((highlight, index) => (
    //                         <Badge
    //                           key={index}
    //                           variant="secondary"
    //                           className="text-xs"
    //                         >
    //                           {highlight}
    //                         </Badge>
    //                       ))}
    //                     {product.highlights.length > 2 && (
    //                       <Badge variant="secondary" className="text-xs">
    //                         +{product.highlights.length - 2}
    //                       </Badge>
    //                     )}
    //                   </div>
    //                 </div>
    //               )}
    //             </CardContent>

    //             <CardFooter className="mt-auto">
    //               <Button
    //                 disabled={isAdding}
    //                 onClick={() => handleAddToCart(product)}
    //                 className="w-full bg-[#73808c] hover:bg-[#5a5a5a] text-white rounded-md py-2 flex items-center justify-center gap-2"
    //               >
    //                 {isAdding ? (
    //                   <div className="flex items-center gap-2">
    //                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
    //                     Adicionando...
    //                   </div>
    //                 ) : (
    //                   <div className="flex items-center gap-2">
    //                     <Plus className="w-4 h-4" />
    //                     Adicionar à proposta
    //                   </div>
    //                 )}
    //               </Button>
    //             </CardFooter>
    //           </Card>
    //         ))
    //       )}
    //     </div>
    //   </main>

    //   <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    // </div>
  );
}
