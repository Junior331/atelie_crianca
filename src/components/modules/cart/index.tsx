"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import {
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Users,
  MessageCircle,
  X,
} from "lucide-react";

import { Card } from "@/components/organisms";
import { Label } from "@/components/atoms/Label";
import { Button, Input } from "@/components/atoms";
import { Textarea } from "@/components/atoms/Textarea";
import {
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/organisms/Card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/atoms/Sheet";
import { getImage } from "@/assets/images";

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSheet({ isOpen, onClose }: CartSheetProps) {
  const { items, removeItem, clearCart } = useCart();
  const [formData, setFormData] = useState({
    eventDate: "",
    startTime: "",
    endTime: "",
    location: "",
    childrenCount: "",
    isReturningClient: "",
    additionalInfo: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateWhatsAppMessage = () => {
    const itemsList = items.map((item) => `• ${item.name}`).join("\n");

    const message = `🎉 *SOLICITAÇÃO DE ORÇAMENTO*

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
    onClose();
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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold text-white">
              Seu Carrinho
            </SheetTitle>

            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="text-white hover:text-[#b42165] hover:bg-white/10 p-2 relative"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Cart Items */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-white">
              <span>🎨</span>
              Oficinas Selecionadas ({items.length})
            </h3>

            {items.length === 0 ? (
              <Card className="p-6 text-center shadow-none">
                <div className="text-4xl mb-2">🛒</div>
                <p className="text-white">Seu carrinho está vazio</p>
                <p className="text-sm text-white mt-1">
                  Adicione algumas oficinas incríveis!
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <Card key={item.id} className="p-3 shadow-none">
                    <div className="flex items-start gap-3">
                      <Image
                        width={300}
                        height={200}
                        alt={item.name}
                        src={item.image || getImage("fallback")}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-white">{item.name}</h4>
                        <p className="text-xs text-white mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-[#b42165] hover:text-[#b42165] hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Event Form */}
          {items.length > 0 && (
            <Card className="!shadow-none border-0">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <Calendar className="w-5 h-5 text-white" />
                  Dados do Evento
                </CardTitle>
              </CardHeader>

              <CardContent className="p-2 space-y-4 border border-[#E5E7EB] rounded-lg">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label
                      htmlFor="eventDate"
                      className="flex items-center gap-2 text-white"
                    >
                      <Calendar className="w-4 h-4 text-white" />
                      Data do Evento *
                    </Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) =>
                        handleInputChange("eventDate", e.target.value)
                      }
                      className="mt-1 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label
                        htmlFor="startTime"
                        className="flex items-center gap-2 text-white"
                      >
                        <Clock className="w-4 h-4 text-white" />
                        Início *
                      </Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) =>
                          handleInputChange("startTime", e.target.value)
                        }
                        className="mt-1 text-white"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="startTime"
                        className="flex items-center gap-2 text-white"
                      >
                        <Clock className="w-4 h-4 text-white" />
                        Término *
                      </Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={(e) =>
                          handleInputChange("endTime", e.target.value)
                        }
                        className="mt-1 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="location"
                      className="flex items-center gap-2 text-white"
                    >
                      <MapPin className="w-4 h-4 text-white" />
                      Local (endereço completo) *
                    </Label>
                    <Textarea
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      placeholder="Rua, número, bairro, cidade..."
                      className="mt-1 text-white"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="childrenCount"
                      className="flex items-center gap-2 text-white"
                    >
                      <Users className="w-4 h-4 text-white" />
                      Quantidade estimada de crianças *
                    </Label>
                    <Input
                      id="childrenCount"
                      type="number"
                      min="1"
                      value={formData.childrenCount}
                      onChange={(e) =>
                        handleInputChange("childrenCount", e.target.value)
                      }
                      placeholder="Ex: 15"
                      className="mt-1 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="isReturningClient" className="text-white">
                      Já foi nossa cliente? *
                    </Label>
                    <select
                      id="isReturningClient"
                      value={formData.isReturningClient}
                      onChange={(e) =>
                        handleInputChange("isReturningClient", e.target.value)
                      }
                      className="w-full mt-1 px-3 py-2 border text-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b42165]"
                    >
                      <option value="" className="text-black">Selecione...</option>
                      <option value="Sim" className="text-black">Sim, já contratei antes</option>
                      <option value="Não" className="text-black">Não, é minha primeira vez</option>
                    </select>
                  </div>

                  <div>
                    <Label
                      htmlFor="additionalInfo"
                      className="flex items-center gap-2 text-white"
                    >
                      <MessageCircle className="w-4 h-4 text-white" />
                      Informações adicionais
                    </Label>
                    <Textarea
                      id="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={(e) =>
                        handleInputChange("additionalInfo", e.target.value)
                      }
                      placeholder="Tema da festa, preferências, observações..."
                      className="mt-1 text-white"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reserve Button */}
          {items.length > 0 && (
            <div className="sticky -bottom-6 pt-4">
              <Button
                onClick={handleReserve}
                disabled={!isFormValid()}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 text-lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                RESERVAR VIA WHATSAPP
              </Button>
              <p className="text-xs text-white text-center mt-2">
                * Campos obrigatórios devem ser preenchidos
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
