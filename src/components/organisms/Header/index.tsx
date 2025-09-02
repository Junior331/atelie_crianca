"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Menu, X, Heart } from "lucide-react";

import { cn } from "@/utils/utils";
import { HeaderProps } from "./@types";
import { Button } from "@/components/atoms";
import { useCart } from "@/hooks/use-cart";
import { useProducts } from "@/hooks/use-products";
import { useFavorites } from "@/hooks/use-favorites";
import { CartSheet } from "@/components/modules/cart";

const navigationItems = [
  { name: "Quem somos", href: "/about" },
  { name: "Oficinas", href: "/workshops" },
  { name: "Brinquedoteca", href: "/playroom" },
  { name: "Casamento", href: "/wedding" },
  { name: "Produtos", href: "/products" },
  { name: "Mesa de Lanchinho", href: "/souvenirstable" },
  { name: "Portfólio", href: "/portfolio" },
  { name: "Mobiliário", href: "/furniture" },
  { name: "Grupo Ateliê", href: "/ateliegroup" },
];

const Header = ({ isSecundary = true }: HeaderProps) => {
  const { items } = useCart();
  const { favoritesCount } = useFavorites();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isCartOpen, setIsCartOpen } = useProducts();

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm",
        isSecundary &&
          "sticky"
      )}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {/* Top bar with logo and icons */}
      <div>
        <div className="mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - empty for balance */}
            <div className="flex-1" />

            {/* Center - Logo */}
            <motion.div
              className="flex-shrink-0"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link href="/" className="block">
                <Image
                  width={180}
                  height={60}
                  alt="Ateliê de Criança"
                  src="/images/logo_dark.png"
                  className="h-12 w-auto object-contain"
                />
              </Link>
            </motion.div>

            {/* Right side - Icons */}
            <motion.div
              className="flex-1 flex items-center justify-end space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Favorites Icon */}
              <Link href="/favorites">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-600 hover:text-[rgb(255,147,186)] p-2 relative"
                >
                  <Heart className="w-5 h-5" />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[rgb(255,147,186)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {favoritesCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Cart Icon */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsCartOpen(true)}
                className="text-gray-600 hover:text-[rgb(255,147,186)] p-2 relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[rgb(255,147,186)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {items.length}
                  </span>
                )}
              </Button>

              {/* Mobile Menu Button */}
              <Button
                size="sm"
                variant="ghost"
                className="xl:hidden text-gray-600 hover:text-[rgb(255,147,186)] p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <div className="mx-auto px-4">
        <nav className="hidden xl:flex items-center justify-center space-x-8 py-4">
          {navigationItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
            >
              <Link
                href={item.href}
                className="text-gray-700 hover:text-[rgb(255,147,186)] transition-colors duration-200 font-medium text-sm uppercase tracking-wide"
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            className="xl:hidden py-4 border-t border-gray-100"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-3">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="text-gray-700 hover:text-[rgb(255,147,186)] transition-colors duration-200 font-medium py-2 block text-sm uppercase tracking-wide"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        )}
      </div>

      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </motion.header>
  );
};

export { Header };
