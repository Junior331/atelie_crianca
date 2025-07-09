import { Search, ShoppingCart } from "lucide-react";

import { HeaderProps } from "./@types";
import { useCart } from "@/hooks/use-cart";
import { Badge } from "@/components/atoms/Badge";
import { Button, Input } from "@/components/atoms";

const categories = [
  { id: "all", name: "TODAS AS OFICINAS", icon: "🎉" },
  { id: "essentials", name: "NÃO PODE FALTAR", icon: "⭐" },
  { id: "favorites", name: "AS QUERIDINHAS", icon: "💖" },
  { id: "weddings", name: "PARA CASAMENTOS", icon: "💒" },
  { id: "souvenir", name: "LEMBRANCINHAS", icon: "🎁" },
];

export const Header = ({
  setIsCartOpen,
  selectedCategory,
  setSelectedCategory,
}: HeaderProps) => {
  const { items } = useCart();

  return (
    <header className="border-b border-[#eaeaea] px-4 py-3 mb-5 shadow-[0px_2px_4px_0px_rgba(24,_27,_27,_0.15)]">
      <div className="mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="text-2xl font-bold text-[#000000]">
            Ateliê
            <div className="text-xs font-normal tracking-wider text-[#787885]">
              DE CRIANÇA
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-7xl mx-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="Pesquisar"
              className="w-full pl-4 pr-10 py-2 border border-[#eaeaea] rounded-md text-sm"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#787885]" />
          </div>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsCartOpen(true)}
            variant="ghost"
            size="icon"
            className="relative hover:bg-gray-200"
          >
            <ShoppingCart className="w-5 h-5 text-[#787885]" />
            {items.length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full max-w-5 h-5 flex items-center justify-center text-xs">
                {items.length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      <div className="mx-auto pt-6 pb-5">
        <div className="flex items-center justify-between gap-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`text-sm font-medium text-[#000000]  rounded-full px-4 py-2 ${
                selectedCategory === category.id && "border border-[#000000]"
              }`}
            >
              <span className="mr-2 text-lg">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
