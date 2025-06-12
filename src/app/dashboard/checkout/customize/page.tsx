'use client'; import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function CustomCheckout() {
  const [components, setComponents] = useState({
    contactInfo: true,
    addressInfo: true,
    paymentMethods: true,
    cardDetails: true,
    orderSummary: true,
    payButton: true
  });

  const toggleComponent = (component: keyof typeof components) => {
    setComponents(prev => ({
      ...prev,
      [component]: !prev[component]
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Personalizar Checkout</h1>
      <p className="text-muted-foreground">
        Marque/desmarque os componentes que deseja incluir no seu checkout
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1 - Configuração */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Componentes do Checkout
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="contactInfo"
                  checked={components.contactInfo}
                  onCheckedChange={() => toggleComponent('contactInfo')}
                />
                <Label htmlFor="contactInfo">Informações de Contacto</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="addressInfo"
                  checked={components.addressInfo}
                  onCheckedChange={() => toggleComponent('addressInfo')}
                />
                <Label htmlFor="addressInfo">Informações de Endereço</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="paymentMethods"
                  checked={components.paymentMethods}
                  onCheckedChange={() => toggleComponent('paymentMethods')}
                />
                <Label htmlFor="paymentMethods">Métodos de Pagamento</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cardDetails"
                  checked={components.cardDetails}
                  onCheckedChange={() => toggleComponent('cardDetails')}
                />
                <Label htmlFor="cardDetails">Detalhes do Cartão</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="orderSummary"
                  checked={components.orderSummary}
                  onCheckedChange={() => toggleComponent('orderSummary')}
                />
                <Label htmlFor="orderSummary">Resumo do Pedido</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="payButton"
                  checked={components.payButton}
                  onCheckedChange={() => toggleComponent('payButton')}
                />
                <Label htmlFor="payButton">Botão de Pagamento</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna 2 - Informações de Envio (ocupa 1 coluna em desktop) */}
        <div className="lg:col-span-1 space-y-4">
          {components.contactInfo && (
            <Card>
              <CardHeader>
                <CardTitle>Informações de Envio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="fullName">Nome Completo</Label>
                    <Input id="fullName" placeholder="Nome Completo" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" placeholder="Telefone" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="Email" />
                </div>
              </CardContent>
            </Card>
          )}

          {components.addressInfo && (
            <Card>
              <CardHeader>
                <CardTitle>Endereço de Envio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="address">Endereço</Label>
                  <Input id="address" placeholder="Barro, Distrito, Província" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="city">Cidade</Label>
                    <Input id="city" placeholder="Cidade" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="postalCode">Código Postal</Label>
                    <Input id="postalCode" placeholder="Código Postal" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {components.paymentMethods && (
            <Card>
              <CardHeader>
                <CardTitle>Método de Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-shrink basis-[calc(25%-0.5rem)] min-w-0">Cartão</Button>
                  <Button variant="outline" className="flex-shrink basis-[calc(25%-0.5rem)] min-w-0">Cartelas</Button>
                  <Button variant="outline" className="flex-shrink basis-[calc(25%-0.5rem)] min-w-0">Paysal</Button>
                  <Button variant="outline" className="flex-shrink basis-[calc(25%-0.5rem)] min-w-0">QR Code</Button>
                </div>

                {components.cardDetails && (
                  <div className="space-y-1 mt-4">
                    <Label htmlFor="cardNumber">Número de Cartão</Label>
                    <Input id="cardNumber" placeholder="1234 1234 1234 1234" />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Coluna 3 - Resumo do Pedido (ocupa 1 coluna em desktop) */}
        <div className="lg:col-span-1 space-y-4">
          {components.orderSummary && (
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Cadeira de madeira Betala</span>
                    <span>MZN 1200,00 x 2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>MZN 2400,00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA (20%)</span>
                    <span>MZN 480,00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frete</span>
                    <span>GRATUITA</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>MZN 2880,00</span>
                  </div>
                </div>

                {components.payButton && (
                  <Button className="w-full mt-6">Pagar</Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}