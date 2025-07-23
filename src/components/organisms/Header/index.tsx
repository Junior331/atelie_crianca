"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Menu, X } from "lucide-react";

import { HeaderProps } from "./@types";
import { Button } from "@/components/atoms";
import { useCart } from "@/hooks/use-cart";
import { useProducts } from "@/hooks/use-products";
import { CartSheet } from "@/components/modules/cart";
import { cn } from "@/utils/utils";

const navigationItems = [
  { name: "Quem somos", href: "/about" },
  { name: "Oficinas", href: "/workshops" },
  { name: "Brinquedoteca", href: "/playroom" },
  { name: "Casamento", href: "/wedding" },
  { name: "Prontos", href: "/ready" },
  { name: "Mesa de lembrancinhas", href: "/souvenirstable" },
  { name: "Portfólio", href: "/portfolio" },
  { name: "Mobiliário", href: "/furniture" },
  { name: "Grupo Ateliê", href: "/ateliegroup" },
];

const Header = ({ isSecundary = true }: HeaderProps) => {
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isCartOpen, setIsCartOpen } = useProducts();

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10",
        isSecundary &&
          "sticky bg-white/90 border-b border-[#eaeaea] shadow-[0px_2px_4px_0px_rgba(24,_27,_27,_0.15)]"
      )}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/">
              <div className="flex items-center">
                <div
                  className={cn(
                    "tetext-2xl font-bold text-white",
                    isSecundary && " text-[#333]"
                  )}
                >
                  Ateliê
                  <div
                    className={cn(
                      "text-xs font-normal tracking-wider text-white",
                      isSecundary && " text-[#333]"
                    )}
                  >
                    DE CRIANÇA
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          <nav className="hidden xl:flex items-center space-x-8">
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "text-white hover:text-yellow-400 transition-colors duration-200 font-medium",
                    isSecundary && "text-[#333]"
                  )}
                  passHref
                  legacyBehavior
                >
                  <a
                    className={cn(
                      "block text-white hover:text-yellow-400 transition-colors duration-200 font-medium",
                      isSecundary && "text-[#333]"
                    )}
                  >
                    {item.name}
                  </a>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right Side Icons */}
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 20 }}
            className="flex items-center space-x-4"
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsCartOpen(true)}
              className={cn(
                "text-white hover:text-yellow-400 hover:bg-white/10 p-2 relative",
                isSecundary && " !text-[#333] hover:bg-black/10"
              )}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {items.length}
              </span>
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className={cn(
                "xl:hidden text-white hover:text-yellow-400 hover:bg-white/10 p-2",
                isSecundary && " !text-[#333] hover:bg-black/10"
              )}
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            className="xl:hidden py-4 border-t border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-3">
              {navigationItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-white hover:text-yellow-400 transition-colors duration-200 font-medium py-2",
                    isSecundary && " !text-[#333]"
                  )}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </motion.a>
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
