import Link from "next/link";
import { ChevronDown, Search, ShoppingCart } from "lucide-react";

import { HeaderProps } from "./@types";
import { useCart } from "@/hooks/use-cart";
import { Badge } from "@/components/atoms/Badge";
import { Button, Input } from "@/components/atoms";
import { useState } from "react";

const menuItems = [
  {
    id: "quem-somos",
    label: "QUEM SOMOS",
    hasDropdown: false,
    href: "/about",
  },
  {
    href: "/",
    id: "oficinas",
    label: "OFICINAS",
    hasDropdown: true,
    subItems: [
      {
        id: "oficinas-especiais",
        label: "OFICINAS ESPECIAIS",
        hasDropdown: true,
        subItems: [
          { id: "essentials", label: "NÃO PODE FALTAR" },
          { id: "favorites", label: "AS QUERIDINHAS" },
        ],
      },
      {
        id: "oficinas-criativas",
        label: "OFICINAS CRIATIVAS",
        hasDropdown: true,
        subItems: [
          { id: "weddings", label: "CASAMENTOS E AFINS" },
          { id: "all", label: "TODAS AS OFICINAS" },
        ],
      },
    ],
  },
  {
    id: "portfolio",
    label: "PORTFÓLIO",
    hasDropdown: false,
    href: "/portfolio",
  },
  {
    id: "mobiliario",
    label: "MOBILIÁRIO",
    hasDropdown: false,
    href: "/furniture",
  },
];

export const Header = ({
  searchTerm,
  setIsCartOpen,
  setSearchTerm,
  onCategoryChange,
  selectedCategory,
}: HeaderProps) => {
  const { items } = useCart();
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  const toggleDropdown = (itemId: string, parentId?: string) => {
    setOpenDropdowns((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      }

      const withParent =
        parentId && !prev.includes(parentId) ? [...prev, parentId] : [...prev];

      const sameLevelItems = parentId
        ? menuItems
            .find((item) => item.id === parentId)
            ?.subItems?.map((i) => i.id) || []
        : menuItems.map((item) => item.id);

      const filtered = withParent.filter((id) => !sameLevelItems.includes(id));

      return [...filtered, itemId];
    });
  };

  const handleCategorySelect = (categoryId: string) => {
    onCategoryChange(categoryId);
    setOpenDropdowns([]);
  };

  // Verifica se o item deve ser um link
  const isLinkItem = (item: (typeof menuItems)[0]) => {
    return !item.hasDropdown && item.href;
  };

  return (
    <header className="border-b border-[#eaeaea] px-4 py-3 mb-5 shadow-[0px_2px_4px_0px_rgba(24,_27,_27,_0.15)]">
      <div className="mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-[#000000]">
              Ateliê
              <div className="text-xs font-normal tracking-wider text-[#787885]">
                DE CRIANÇA
              </div>
            </div>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-7xl mx-8">
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
      <nav className="mx-auto pt-6 pb-0">
        <div className="mx-auto px-4">
          <div className="flex items-center justify-center">
            <ul className="flex flex-wrap items-center justify-start gap-x-8">
              {menuItems.map((item) => (
                <li key={item.id} className="relative group">
                  {isLinkItem(item) ? (
                    // Renderiza como Link para rotas
                    <Link href={item.href!} passHref>
                      <Button
                        variant="ghost"
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                      >
                        {item.label}
                      </Button>
                    </Link>
                  ) : (
                    // Renderiza como botão normal para dropdowns
                    <>
                      <Button
                        variant="ghost"
                        className={`px-4 py-2 text-sm font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-colors ${
                          item.hasDropdown ? "flex items-center gap-1" : ""
                        }`}
                        onClick={() => {
                          if (item.hasDropdown) {
                            toggleDropdown(item.id);
                          } else {
                            handleCategorySelect(item.id);
                          }
                        }}
                      >
                        {item.label}
                        {item.hasDropdown && (
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              openDropdowns.includes(item.id)
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        )}
                      </Button>

                      {/* Dropdown content */}
                      {item.hasDropdown &&
                        item.subItems &&
                        openDropdowns.includes(item.id) && (
                          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[200px]">
                            <ul className="py-2">
                              {item.subItems.map((subItem) => (
                                <li
                                  key={subItem.id}
                                  className="relative group/sub"
                                >
                                  <Button
                                    variant="ghost"
                                    className={`w-full justify-between px-4 py-2 text-sm text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-colors ${
                                      subItem.hasDropdown
                                        ? "flex items-center"
                                        : ""
                                    }`}
                                    onClick={() => {
                                      if (subItem.hasDropdown) {
                                        toggleDropdown(subItem.id, item.id);
                                      } else {
                                        handleCategorySelect(subItem.id);
                                      }
                                    }}
                                  >
                                    {subItem.label}
                                    {subItem.hasDropdown && (
                                      <ChevronDown
                                        className={`w-4 h-4 transition-transform ${
                                          openDropdowns.includes(subItem.id)
                                            ? "rotate-180"
                                            : ""
                                        }`}
                                      />
                                    )}
                                  </Button>

                                  {/* Second Level Dropdown */}
                                  {subItem.hasDropdown &&
                                    subItem.subItems &&
                                    openDropdowns.includes(subItem.id) && (
                                      <div className="absolute top-0 left-full ml-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[180px]">
                                        <ul className="py-2">
                                          {subItem.subItems.map(
                                            (subSubItem) => (
                                              <li key={subSubItem.id}>
                                                <Button
                                                  variant="ghost"
                                                  className={`w-full justify-start px-4 py-2 text-sm transition-colors ${
                                                    selectedCategory ===
                                                    subSubItem.id
                                                      ? "text-pink-600 bg-pink-50 font-medium"
                                                      : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                                                  }`}
                                                  onClick={() =>
                                                    handleCategorySelect(
                                                      subSubItem.id
                                                    )
                                                  }
                                                >
                                                  {subSubItem.label}
                                                </Button>
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      </div>
                                    )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};
