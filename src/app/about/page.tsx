"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Users,
  Award,
  Calendar,
  Lightbulb,
  CalendarCheck,
  Clock,
  Smile,
} from "lucide-react";

import { Footer } from "@/components/modules";
import { LoadingSpinner } from "@/components/atoms";
import { Card, Header } from "@/components/organisms";
import { CardContent } from "@/components/organisms/Card";
import Image from "next/image";

export default function Component() {
  const [isLoading, setIsLoading] = useState(true);

  const stats = [
    { icon: Users, number: "500+", label: "Clientes satisfeitos" },
    { icon: Calendar, number: "1000+", label: "Eventos organizados" },
    { icon: Award, number: "15+", label: "Anos de experiência" },
    { icon: CheckCircle, number: "100%", label: "Índice de satisfação" },
  ];

  const features = [
    {
      id: 1,
      name: "Serviço de excelência",
      icon: Award,
    },
    {
      id: 2,
      name: "Soluções criativas",
      icon: Lightbulb,
    },
    {
      id: 3,
      name: "Equipa profissional",
      icon: Users,
    },
    {
      id: 4,
      name: "Eventos personalizados",
      icon: CalendarCheck,
    },
    {
      id: 5,
      name: "Anos de existência",
      icon: Clock,
    },
    {
      id: 6,
      name: "Clientes satisfeitos",
      icon: Smile,
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
          <Header />
          <div className="py-10 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 relative line">
                    Quem somos
                  </h2>

                  <p className="text-lg text-[#85888a] mb-6">
                    Com mais de 15 anos de experiência na criação de eventos, a
                    Atelie Criança tornou-se um dos nomes mais confiáveis no
                    planeamento e gestão de eventos. Somos especializados em
                    transformar a sua visão em realidade, com atenção meticulosa
                    aos detalhes e criatividade incomparável.
                  </p>

                  <p className="text-lg text-[#85888a] mb-8">
                    A nossa equipa de profissionais experientes dedica-se a
                    tornar cada evento único e memorável. Desde reuniões íntimas
                    a grandes celebrações, tratamos de todos os aspetos do seu
                    evento com precisão e cuidado.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {features.map((feature, index) => (
                      <motion.div
                        key={feature.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center space-x-2"
                      >
                        <div className="flex place-content-center place-items-center w-10 h-10 bg-gold rounded-full bg-[#f8d07a33]">
                          <feature.icon color="#e6b34c" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-primary">
                            {feature.name}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Image */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <Image
                    width={1200}
                    height={800}
                    alt="About"
                    src="/images/about.jpeg"
                    className="w-full h-96 object-cover rounded-lg shadow-elegant"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg" />
                </motion.div>
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
              >
                {stats.map((stat, index) => (
                  <Card
                    key={stat.label}
                    className="text-center shadow-soft hover:shadow-elegant transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center justify-center w-12 h-12 bg-gradient-gold rounded-full mb-4"
                      >
                        <stat.icon className="w-6 h-6 text-gold-dark" />
                      </motion.div>
                      <h3 className="text-3xl font-bold text-primary mb-2">
                        {stat.number}
                      </h3>
                      <p className="text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </div>
          </div>
          <Footer />
        </motion.main>
      )}
    </AnimatePresence>
  );
}
