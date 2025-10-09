/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { getAllPossiblePaths } from "@/utils/image-converter";

interface SmartImageProps {
  basePath: string;
  imageName: string;
  alt: string;
  fill?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

export const SmartImage = ({ 
  basePath, 
  imageName, 
  alt, 
  fill = false, 
  className,
  width,
  height 
}: SmartImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const findWorkingImage = async () => {
      setIsLoading(true);
      setHasError(false);
      
      const possiblePaths = getAllPossiblePaths(basePath, imageName);
      
      // Testar cada caminho possível
      for (const path of possiblePaths) {
        try {
          const response = await fetch(path, { method: 'HEAD' });
          if (response.ok) {
            setImageSrc(path);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          // Continuar para próximo formato
          continue;
        }
      }
      
      // Se chegou aqui, nenhuma imagem foi encontrada
      setHasError(true);
      setIsLoading(false);
    };

    findWorkingImage();
  }, [basePath, imageName]);

  if (isLoading) {
    return (
      <div className={`bg-white animate-pulse flex-1 h-full flex items-center justify-center ${className || ''}`}>
        <div className="text-gray-400">Carregando...</div>
      </div>
    );
  }

  if (hasError || !imageSrc) {
    return (
      <div className={`bg-gradient-to-br h-full from-gray-100 to-gray-200 flex items-center justify-center ${className || ''}`}>
        <div className="text-4xl opacity-20">📸</div>
      </div>
    );
  }

  const imageProps = {
    src: imageSrc,
    alt,
    className: `object-cover transition-transform duration-300 hover:scale-105 ${className || ''}`,
    onError: () => setHasError(true)
  };

  if (fill) {
    return <Image {...imageProps} fill />;
  }

  if (width && height) {
    return <Image {...imageProps} width={width} height={height} />;
  }

  return <Image {...imageProps} fill />;
};