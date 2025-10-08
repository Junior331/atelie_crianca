"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ 
            y: [0, -15, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="flex items-center justify-center"
        >
          <Image
            width={64}
            height={64}
            alt="Carregando..."
            src="/images/icon_loading.png"
            className="w-16 h-16 object-contain invert-[0.7]"
          />
        </motion.div>
        <motion.p
          className="mt-4 text-[#5b5b5b] font-medium text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Carregando...
        </motion.p>
      </motion.div>
    </div>
  );
};
export { LoadingSpinner };
