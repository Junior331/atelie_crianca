"use client"

import Image from "next/image"
import { useState } from "react"
import { useCart } from "@/hooks/use-cart"
import { Trash2, Calendar, Clock, MapPin, Users, MessageCircle, X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/atoms/Sheet"
import { Button, Input } from "@/components/atoms"
import { Card } from "@/components/organisms"
import { Label } from "@/components/atoms/Label"
import { Textarea } from "@/components/atoms/Textarea"
import { CardContent, CardHeader, CardTitle } from "@/components/organisms/Card"
import { Badge } from "@/components/atoms/Badge"

interface CartSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSheet({ isOpen, onClose }: CartSheetProps) {
  const { items, removeItem, clearCart } = useCart()
  const [formData, setFormData] = useState({
    eventDate: "",
    startTime: "",
    endTime: "",
    location: "",
    childrenCount: "",
    isReturningClient: "",
    additionalInfo: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateWhatsAppMessage = () => {
    const itemsList = items.map((item) => `• ${item.name}`).join("\n")

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

Aguardo retorno para orçamento! 😊`

    return encodeURIComponent(message)
  }

  const handleReserve = () => {
    const whatsappNumber = "5521969927151"
    const message = generateWhatsAppMessage()
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

    window.open(whatsappUrl, "_blank")
    clearCart()
    onClose()
  }

  const isFormValid = () => {
    return (
      formData.eventDate &&
      formData.startTime &&
      formData.endTime &&
      formData.location &&
      formData.childrenCount &&
      formData.isReturningClient
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold">
              🛒 Seu Carrinho
            </SheetTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Cart Items */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span>🎨</span>
              Oficinas Selecionadas ({items.length})
            </h3>

            {items.length === 0 ? (
              <Card className="p-6 text-center">
                <div className="text-4xl mb-2">🛒</div>
                <p className="text-gray-500">Seu carrinho está vazio</p>
                <p className="text-sm text-gray-400 mt-1">Adicione algumas oficinas incríveis!</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <Card key={item.id} className="p-3">
                    <div className="flex items-start gap-3">
                      <Image
                        alt={item.name}
                        src={item.image || "/placeholder.svg"}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {item.duration}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {item.ageRange}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
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
            <Card className="p-4">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-pink-500" />
                  Dados do Evento
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="eventDate" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Data do Evento *
                    </Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => handleInputChange("eventDate", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="startTime" className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Início *
                      </Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => handleInputChange("startTime", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="startTime" className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Término *
                      </Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => handleInputChange("endTime", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Local (endereço completo) *
                    </Label>
                    <Textarea
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="Rua, número, bairro, cidade..."
                      className="mt-1"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="childrenCount" className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Quantidade estimada de crianças *
                    </Label>
                    <Input
                      id="childrenCount"
                      type="number"
                      min="1"
                      value={formData.childrenCount}
                      onChange={(e) => handleInputChange("childrenCount", e.target.value)}
                      placeholder="Ex: 15"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="isReturningClient">Já foi nossa cliente? *</Label>
                    <select
                      id="isReturningClient"
                      value={formData.isReturningClient}
                      onChange={(e) => handleInputChange("isReturningClient", e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="Sim">Sim, já contratei antes</option>
                      <option value="Não">Não, é minha primeira vez</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="additionalInfo" className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Informações adicionais
                    </Label>
                    <Textarea
                      id="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                      placeholder="Tema da festa, preferências, observações..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reserve Button */}
          {items.length > 0 && (
            <div className="sticky -bottom-6 bg-white pt-4">
              <Button
                onClick={handleReserve}
                disabled={!isFormValid()}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 text-lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                RESERVAR VIA WHATSAPP
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">* Campos obrigatórios devem ser preenchidos</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
