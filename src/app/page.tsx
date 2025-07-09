"use client";

import Image from "next/image";
import { useState } from "react";
import { Clock, Plus, Star, Users } from "lucide-react";

import { Button } from "@/components/atoms";
import { getImage } from "@/assets/images";
import { Header } from "@/components/organisms";
import { CartSheet } from "@/components/modules/cart";
import { products } from "@/utils/products";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/types/product";
import { Badge } from "@/components/atoms/Badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/organisms/Card";

export default function Component() {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const handleAddToCart = async (product: Product) => {
    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simula loading
    addItem(product);
    setIsAdding(false);
  };

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case "essentials":
        return { name: "Não Pode Faltar", color: "bg-yellow-500", icon: "⭐" };
      case "favorites":
        return { name: "As Queridinhas", color: "bg-pink-500", icon: "💖" };
      case "weddings":
        return { name: "Casamentos", color: "bg-purple-500", icon: "💒" };
      case "souvenir":
        return { name: "Lembrançinhas", color: "bg-purple-500", icon: "🎁" };
      default:
        return { name: "Geral", color: "bg-blue-500", icon: "🎉" };
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff]">
      <Header
        setIsCartOpen={setIsCartOpen}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Products Section */}
      <main className="md:max-w-5/6 mx-auto px-4 py-5">
        <section className="relative h-[400px] overflow-hidden">
          <Image
            src={getImage("banner_home")}
            alt="Ateliê de Criança Workshop"
            fill
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-[96px] text-[#F0E9E1] font-extrabold leading-none tracking-[-0.48px]">
                Ateliê
              </h1>
              <p className="text-[31px] text-[#F0E9E1] font-light tracking-[10.625px] uppercase">
                DE CRIANÇA
              </p>
            </div>
          </div>
        </section>

        <div className="mb-6">
          <p className="text-sm text-[#787885]">
            <span className="font-semibold text-[#000000]">
              {filteredProducts.length}
            </span>{" "}
            resultados
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-2 border-transparent hover:border-pink-200 flex flex-col h-full"
            >
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="flex flex-wrap gap-1.5 absolute top-3 left-3">
                    <Badge
                      className={`${
                        getCategoryInfo(product.category).color
                      } text-white`}
                    >
                      <span className="mr-1">
                        {getCategoryInfo(product.category).icon}
                      </span>
                      {product.name}
                    </Badge>
                    {product.isPopular && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-grow">
                <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-pink-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{product.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{product.ageRange}</span>
                  </div>
                </div>

                {product.highlights && product.highlights.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {product.highlights
                        .slice(0, 2)
                        .map((highlight, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {highlight}
                          </Badge>
                        ))}
                      {product.highlights.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{product.highlights.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="mt-auto">
                <Button
                  disabled={isAdding}
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-[#73808c] hover:bg-[#5a5a5a] text-white rounded-md py-2 flex items-center justify-center gap-2"
                >
                  {isAdding ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adicionando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Adicionar à proposta
                    </div>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Footer */}
      <footer className="bg-[#000000] text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-lg">
              Criando momentos especiais desde sempre ✨
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="font-semibold mb-2 flex items-center justify-center gap-2">
                📞 Contato
              </h4>
              <p className="text-sm text-[#c9c9c9]">
                WhatsApp: (11) 99999-9999
              </p>
              <p className="text-sm text-[#c9c9c9]">
                Email: contato@oficinacriancas.com
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center justify-center gap-2">
                🕐 Horário
              </h4>
              <p className="text-sm text-[#c9c9c9]">
                Segunda à Sexta: 8h às 18h
              </p>
              <p className="text-sm text-[#c9c9c9]">Sábados: 9h às 14h</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center justify-center gap-2">
                📍 Atendimento
              </h4>
              <p className="text-sm text-[#c9c9c9]">Rio de Janeiro e região</p>
              <p className="text-sm text-[#c9c9c9]">Eventos personalizados</p>
            </div>
          </div>

          <div className="text-center mt-8 pt-4 border-t border-[#383838]">
            <p className="text-xs text-[#787885]">
              © 2024 ateliê de criança. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}