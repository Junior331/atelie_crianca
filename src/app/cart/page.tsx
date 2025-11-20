"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingCart as ShoppingCartIcon } from "lucide-react";

import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/modules";
import { Button } from "@/components/atoms";
import { CardContent, CardHeader, CardTitle } from "@/components/organisms/Card";
import { useCart } from "@/hooks/use-cart";
import { getImage } from "@/assets/images";
import { getIcon } from "@/assets/icons";

export default function CartPage() {
  const { items, removeItem, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    eventDate: "",
    startTime: "",
    endTime: "",
    location: "",
    childrenCount: 0,
    eventHours: 0,
    isReturningClient: "",
    additionalInfo: "",
  });

  const generateWhatsAppMessage = () => {
    const itemsList = items
      .map((item) => {
        const quantity = item.quantity || 1;
        return `• ${item.name}${quantity > 1 ? ` (x${quantity})` : ""}`;
      })
      .join("%0A");

    const message =
`*SOLICITAÇÃO DE ORÇAMENTO*
%0A
*OFICINAS SELECIONADAS:*%0A${itemsList}
%0A%0A
*DADOS DO EVENTO:*%0A• Quantidade de crianças: ${formData.childrenCount}%0A• Horas de evento: ${formData.eventHours}%0A• Local da festa: ${formData.location}
%0A%0A
Aguardo retorno para orçamento!`;

    return message;
  };

  const handleReserve = () => {
    if (!isFormValid()) return;

    setIsSubmitting(true);

    const whatsappNumber = "5521982533717";
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    // Abrir WhatsApp em nova aba
    window.open(whatsappUrl, "_blank");

    setTimeout(() => {
      setIsSubmitting(false);
      clearCart();
    }, 2000);
  };

  const isFormValid = () => {
    // Validação completa: itens, quantidade de crianças, horas de evento e local da festa
    return (
      items.length > 0 &&
      formData.childrenCount > 0 &&
      formData.eventHours > 0 &&
      formData.location.trim() !== ""
    );
  };

  const handleAddMoreItems = () => {
    window.location.href = "/workshops";
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
                  className="bg-[#b42165] text-white"
                  onClick={() => window.history.back()}
                >
                  Voltar às Oficinas
                </Button>
              </motion.div>
            ) : (
              <div className="flex flex-col lg:flex-row w-full ">
                {/* Cart Items */}
                <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <div className=" h-full p-4  border-b lg:border-r lg:border-b-0 border-gray-200">
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
                              <div className="relative">
                                <Image
                                  width={300}
                                  height={200}
                                  alt={item.name}
                                  src={item.image || getImage("fallback")}
                                  className="w-20 h-20 object-cover rounded-lg"
                                />
                                {item.quantity && item.quantity > 1 && (
                                  <div className="absolute -top-2 -right-2 bg-[#FF5E1F] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                    {item.quantity}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg text-[#615C5C]">{item.name}</h4>
                                <p className="text-sm text-[#8A8A8A] line-clamp-2">{item.description}</p>
                                {item.quantity && item.quantity > 1 && (
                                  <p className="text-xs text-[#615C5C] mt-1 font-medium">
                                    Quantidade: {item.quantity}
                                  </p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="text-[#b42165] hover:text-[#B8005C] hover:bg-red-50 p-2"
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
                  className="flex-1"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="ml-4 pr-4 pb-4 lg:pb-0 border-b lg:border-r lg:border-b-0 border-gray-200 flex items-center flex-col">
                    <CardHeader className="pl-10 pr-10">
                      <CardTitle className="text-2xl flex items-center gap-2 text-[#615C5C]">
                        QUANTIDADE DE CRIANÇAS
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex items-center justify-center">
                      <div
                        className={`h-9 flex items-center gap-4 mt-2 bg-gray-200 justify-center w-[170px] rounded-2xl transition-all`}
                      >
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
                              childrenCount: Math.max(0, Number(e.target.value)),
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
                        <div
                          className={`h-9 flex items-center gap-4 mt-2 bg-gray-200 justify-center w-[170px] rounded-2xl transition-all`}
                        >
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
                                eventHours: Math.max(0, Number(e.target.value)),
                              }))
                            }
                            className="w-16 text-center rounded-lg py-1"
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
                     <div className="mt-[50px]">
                        <label className="text-sm text-[#615C5C] font-medium mb-1 block text-start">
                          Local da festa
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Buffet ABC, Salão de festas, Residência..."
                          value={formData.location}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          className={`w-[300px] h-9 p-[5px] border text-[#615C5C] rounded-sm focus:outline-none focus:ring-2 transition-all ${
                            formData.location.trim() === "" && items.length > 0
                              ? "border-red-300 focus:ring-red-200"
                              : "border-gray-300 focus:ring-blue-200"
                          }`}
                        />
                      </div>
                  </div>
                </motion.div>

                {/* Reserve Button */}
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex-1 flex justify-center pb-8"
                >
                  <div className="w-full max-w-md flex flex-col justify-center p-4 ">
                    <Button
                      onClick={handleReserve}
                      disabled={!isFormValid() || isSubmitting}
                      className={`max-w-[400px] h-[50px] bg-[#FF5E1F] hover:bg-[#e54e0f] text-white py-4 text-lg rounded-none transition-all ${
                        !isFormValid() || isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Abrindo WhatsApp...
                        </>
                      ) : (
                        <>
                          <Image src={getIcon("whatsapp")} alt="Whatsapp" width={20} height={20} className="mr-2" />
                          SOLICITE ORÇAMENTO
                        </>
                      )}
                    </Button>


                    <Button
                      onClick={handleAddMoreItems}
                      className="max-w-[400px] h-[50px] border border-[#615C5C] text-[#615C5C]  py-4 text-lg mt-[20px] rounded-none"
                      >
                      Adicionar mais itens
                    </Button>
                      {!isFormValid() && items.length > 0 && (
                        <div className="text-sm text-red-500 mt-2 text-start">
                          <p className="font-medium">Preencha todos os campos obrigatórios:</p>
                          <ul className="text-xs mt-1 space-y-1">
                            {formData.childrenCount === 0 && <li>• Quantidade de crianças</li>}
                            {formData.eventHours === 0 && <li>• Horas de evento</li>}
                            {formData.location.trim() === "" && <li>• Local da festa</li>}
                          </ul>
                        </div>
                      )}
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
