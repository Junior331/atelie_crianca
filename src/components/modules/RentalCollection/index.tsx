"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

import { Product } from "@/types/product";
import { useCart } from "@/hooks/use-cart";
import { Card } from "@/components/organisms";
import { Button, Input } from "@/components/atoms";
import { useProducts } from "@/hooks/use-products";
import { CardContent } from "@/components/organisms/Card";

const categories = [
  { name: "Todos os itens", id: "all" },
  { name: "Não Pode Faltar", id: "essentials" },
  { name: "As Queridinhas", id: "favorites" },
  { name: "Casamentos", id: "weddings" },
  { name: "Lembrançinhas", id: "souvenir" },
];

const RentalCollection = () => {
  const ref = useRef(null);
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { searchTerm, setSearchTerm, filteredItems } = useProducts();

  const handleAddToCart = async (product: Product) => {
    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    addItem(product);
    setIsAdding(false);
  };

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-start mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Oficinas
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl">
            Navegue pela nossa extensa coleção de Oficinas de alta qualidade
            para tornar o seu evento especial.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className={`flex-1 md:max-w-32 ${
                activeCategory === category.id
                  ? "bg-[#f8d07a] hover:bg-[#e6b34c] text-black"
                  : "hover:bg-rose-50 hover:text-[#333]"
              }`}
            >
              {category.name}
            </Button>
          ))}
          <div className="flex-1 max-w-3xl min-w-2xs">
            <div className="relative">
              <Input
                type="text"
                placeholder="Pesquisar"
                className="w-full pl-4 pr-10 py-2 border border-[#eaeaea] rounded-md text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#787885]" />
            </div>
          </div>
        </motion.div>

        <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" layout>
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 flex flex-col">
                {item.image ? (
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <Image
                      fill
                      alt={item.name}
                      src={item.image}
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                    <div className="text-6xl opacity-20">📸</div>
                  </div>
                )}
                <CardContent className="p-4 flex flex-col flex-grow">
                  <div className="mb-2">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-auto">
                    <Button
                      size="sm"
                      disabled={isAdding}
                      onClick={() => handleAddToCart(item)}
                      className="w-full bg-[#f8d07a] hover:bg-[#e6b34c] text-[#333]"
                    >
                      {isAdding ? `Adicionando...` : `Adicionar ao orçamento`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export { RentalCollection };
