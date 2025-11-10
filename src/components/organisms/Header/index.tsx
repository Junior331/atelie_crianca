"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { cn } from "@/utils/utils";
import { HeaderProps } from "./@types";
import { Button } from "@/components/atoms";
import { useCart } from "@/hooks/use-cart";
import { useFavorites } from "@/hooks/use-favorites";
import { useFeatureFlags } from "@/hooks/use-feature-flags";
import { SearchBar } from "@/components/organisms/SearchBar";

const allNavigationItems = [
  { name: "Quem somos", href: "/about", slug: "about" },
  { name: "Oficinas", href: "/workshops", slug: "workshops" },
  { name: "Brinquedoteca", href: "/playroom", slug: "playroom" },
  { name: "Casamentos", href: "/wedding", slug: "wedding" },
  { name: "Produtos", href: "/products", slug: "products" },
  {
    name: "Mesa de Lanchinho",
    href: "/souvenirstable",
    slug: "souvenirstable",
  },
  { name: "Corporativo", href: "/corporate", slug: "corporate" },
  { name: "Mobiliário", href: "/furniture", slug: "furniture" },
  { name: "Grupo Ateliê", href: "/ateliegroup", slug: "ateliegroup" },
];

const Header = ({ isSecundary = true }: HeaderProps) => {
  const { items } = useCart();
  const { favoritesCount } = useFavorites();
  const { isEnabled } = useFeatureFlags();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Filter navigation items based on feature flags
  const navigationItems = allNavigationItems.filter((item) =>
    isEnabled(item.slug)
  );

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm",
        isSecundary && "sticky"
      )}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {/* Top bar with logo and icons */}
      <div>
        <div className="mx-auto px-4 py-3">
          <div className="flex items-center justify-between md:gap-4">
            <motion.div
              className="flex-shrink-0 flex-1 flex items-center justify-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link href="/" className="block">
                <Image
                  width={180}
                  height={60}
                  alt="Ateliê de Criança"
                  src="/images/logo_cinza.png"
                  className="h-12 w-auto object-contain"
                />
              </Link>
            </motion.div>

            {/* Right side - Icons */}
            <motion.div
              className="flex items-center justify-end space-x-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div
                className="flex-1 max-w-96 hidden md:block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <SearchBar />
              </motion.div>

              {/* Favorites Icon */}
              <Link href="/favorites">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-[#8A8A8A] hover:text-[#b42165] p-2 relative"
                >
                  <Image
                    src="/images/coracao.png"
                    alt="Sacola"
                    width={16}
                    height={16}
                  />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-[3px] -right-1 bg-[#b42165] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {favoritesCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Cart Icon */}
              <Link href="/cart">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-[#8A8A8A] hover:text-[#b42165] p-2 relative"
                >
                  <Image
                    src="/images/sacola.png"
                    alt="Sacola"
                    width={16}
                    height={16}
                  />
                  {items.length > 0 && (
                    <span className="absolute -top-[2px] -right-[2px] bg-[#b42165] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {items.length}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Mobile Menu Button */}
              <Button
                size="sm"
                variant="ghost"
                className="xl:hidden text-[#8A8A8A] hover:text-[#b42165] p-2"
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
                className="text-[#8A8A8A] hover:text-[#b42165] transition-colors duration-200 font-medium text-sm uppercase tracking-wide"
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
            {/* Mobile Search */}
            <div className="md:hidden mb-4">
              <SearchBar />
            </div>

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
                    className="text-[#8A8A8A] hover:text-[#b42165] transition-colors duration-200 font-medium py-2 block text-sm uppercase tracking-wide"
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
    </motion.header>
  );
};

export { Header };
