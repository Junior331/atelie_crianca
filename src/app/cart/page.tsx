"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, MessageCircle, ShoppingCart as ShoppingCartIcon } from "lucide-react";

import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/modules";
import { Button } from "@/components/atoms";
import { CardContent, CardHeader, CardTitle } from "@/components/organisms/Card";
import { useCart } from "@/hooks/use-cart";
import { getImage } from "@/assets/images";

export default function CartPage() {
  const { items, removeItem, clearCart } = useCart();
  const [formData, setFormData] = useState({
    eventDate: "",
    startTime: "",
    endTime: "",
    location: "",
    childrenCount: 0, // contador de crianças
    eventHours: 0, // contador de horas de evento
    isReturningClient: "",
    additionalInfo: "",
  });

  const generateWhatsAppMessage = () => {
    const itemsList = items.map((item) => `• ${item.name}`).join("\n");

    const message = `🎉 *SOLICITAÇÃO DE ORÇAMENTO - OFICINAS MÁGICAS*

📋 *OFICINAS SELECIONADAS:*
${itemsList}

📅 *DADOS DO EVENTO:*
• Data: ${formData.eventDate}
• Horário: ${formData.startTime} às ${formData.endTime}
• Local: ${formData.location}
• Quantidade de crianças: ${formData.childrenCount}

👥 *CLIENTE:*
• Já foi nossa cliente: ${formData.isReturningClient}

💬 *INFORMAÇÕES ADICIONAIS:*
${formData.additionalInfo || "Nenhuma informação adicional"}

Aguardo retorno para orçamento! 😊`;

    return encodeURIComponent(message);
  };

  const handleReserve = () => {
    const whatsappNumber = "5521969927151";
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    window.open(whatsappUrl, "_blank");
    clearCart();
  };

  const isFormValid = () => {
    return (
      formData.eventDate &&
      formData.startTime &&
      formData.endTime &&
      formData.location &&
      formData.childrenCount &&
      formData.isReturningClient
    );
  };

  return (
    <AnimatePresence mode="wait">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen"
      >
        <Header />

        <div className="py-8  ">
          <div className="w-full px-4l p-8 flex flex-col items-center justify-center ">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-medium  text-[#615C5C] mb-4">SACOLA DE OFICINAS</h1>
              {/* <p className="text-xl text-[#8A8A8A]">
                {items.length === 0 
                  ? "Seu carrinho está vazio"
                  : `${items.length} ${items.length === 1 ? 'oficina selecionada' : 'oficinas selecionadas'}`
                }
              </p> */}
            </motion.div>

            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center py-16"
              >
                <ShoppingCartIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-[#8A8A8A] mb-2">Seu carrinho está vazio</h3>
                <p className="text-[#8A8A8A] mb-6">Adicione algumas oficinas incríveis para começar!</p>
                <Button
                  className="bg-[#ecced1] hover:bg-[#ecced1] text-[#615C5C]"
                  onClick={() => window.history.back()}
                >
                  Voltar às Oficinas
                </Button>
              </motion.div>
            ) : (
              <div className="flex flex-row  ">
                {/* Cart Items */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <div className=" p-4 border-r border-gray-200 ">
                    <h3 className="font-semibold text-2xl flex items-center gap-2 text-[#615C5C] mb-6">Oficinas</h3>

                    <div className="space-y-4">
                      {items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <div className=" p-4 ">
                            <div className="flex items-start gap-4">
                              <Image
                                width={300}
                                height={200}
                                alt={item.name}
                                src={item.image || getImage("fallback")}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg text-[#615C5C]">{item.name}</h4>
                                <p className="text-sm text-[#8A8A8A] ">{item.description}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="text-[#ecced1] hover:text-[#B8005C] hover:bg-red-50 p-2"
                              >
                                <Trash2 className="w-5 h-5" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Event Form */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className=" border-r border-gray-200 flex items-center flex-col">
                    <CardHeader className="pl-10 pr-10">
                      <CardTitle className="text-2xl flex items-center gap-2 text-[#615C5C]">
                        QUANTIDADE DE CRIANÇAS
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex items-center justify-center">
                      <div className="h-9 flex items-center gap-4 mt-2 bg-gray-200 justify-center w-[170px] rounded-2xl">
                        <Button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              childrenCount: Math.max(0, prev.childrenCount - 1),
                            }))
                          }
                          className="w-8 h-8 flex items-center justify-center text-gray-700"
                        >
                          -
                        </Button>

                        <input
                          type="number"
                          value={formData.childrenCount}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              childrenCount: Number(e.target.value),
                            }))
                          }
                          className="w-16 text-center rounded-md py-1"
                          min={0}
                        />
                        <Button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              childrenCount: prev.childrenCount + 1,
                            }))
                          }
                          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-700"
                        >
                          +
                        </Button>
                      </div>
                    </CardContent>
                    <div className=" flex items-center justify-center flex-col  ">
                      <CardHeader className="pl-10 pr-10 mt-8">
                        <CardTitle className="text-2xl flex items-center gap-2 text-[#615C5C]">
                          HORAS DE EVENTO
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 flex items-center justify-center">
                        <div className="h-9 flex items-center gap-4 mt-2 bg-gray-200 justify-center w-[170px] rounded-2xl">
                          <Button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                eventHours: Math.max(0, prev.eventHours - 1),
                              }))
                            }
                            className="w-8 h-8 flex items-center justify-center text-gray-700"
                          >
                            -
                          </Button>

                          <input
                            type="number"
                            value={formData.eventHours}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                eventHours: Number(e.target.value),
                              }))
                            }
                            className="w-16 text-center rounded-md py-1"
                            min={0}
                          />
                          <Button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                eventHours: prev.eventHours + 1,
                              }))
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-700"
                          >
                            +
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                     <input
                          type="text"
                          placeholder="UF"
                          className="w-[300px] h-9 p-[5px] border-2 mt-[50px] "
                          min={0}
                        />
                  </div>
                </motion.div>

                {/* Reserve Button */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex justify-center pb-8"
                >
                  <div className="w-full max-w-md flex flex-col justify-center p-[45px] ">
                    <Button
                      onClick={handleReserve}
                      disabled={!isFormValid()}
                      className="w-[400px] h-[50px] bg-[#FF5E1F]  text-white py-4 text-lg rounded-none"
                    >
                      <MessageCircle className="w-6 h-6 mr-2" />
                      SOLICITE ORÇAMENTO
                    </Button>
                      <Button
                      onClick={handleReserve}
                      disabled={!isFormValid()}
                      className="w-[400px] h-[50px] border border-[#615C5C] text-[#615C5C]  py-4 text-lg mt-[20px] rounded-none"
                    >
                      Adicionar mais intens 
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </motion.main>
    </AnimatePresence>
  );
}
