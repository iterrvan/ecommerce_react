import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { EcommerceAPI, formatPrice, getProductImageUrl } from '@/lib/api';
import { useLocation } from 'wouter';
import { ShoppingCart, CreditCard, Truck, Shield, ArrowLeft, Check } from 'lucide-react';
import { Link } from 'wouter';
import type { CheckoutFormData } from '@/types';

// ESQUEMA DE VALIDACIÓN
const checkoutSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'El email es requerido'),
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  address: z.string().min(1, 'La dirección es requerida'),
  city: z.string().min(1, 'La ciudad es requerida'),
  postalCode: z.string().min(1, 'El código postal es requerido'),
  country: z.string().min(1, 'El país es requerido'),
  phone: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, navigate] = useLocation();
  const { summary, clearCart } = useCart();
  const { toast } = useToast();
  
  // ESTADO LOCAL
  const [isProcessing, setIsProcessing] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [currentStep, setCurrentStep] = useState(1);

  // CONFIGURACIÓN DEL FORMULARIO
  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'España',
      phone: '',
    },
  });

  // REDIRIGIR SI EL CARRITO ESTÁ VACÍO
  if (summary.itemCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Carrito Vacío</h1>
          <p className="text-gray-600 mb-6">
            No tienes productos en tu carrito. Agrega algunos productos antes de proceder al checkout.
          </p>
          <Link href="/products">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continuar Comprando
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // HANDLER DEL FORMULARIO
  const onSubmit = async (data: CheckoutForm) => {
    if (!acceptTerms) {
      toast({
        title: "Error",
        description: "Debes aceptar los términos y condiciones",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // CREAR PEDIDO
      const response = await EcommerceAPI.createOrder(data);
      
      if (response.order) {
        // LIMPIAR CARRITO
        await clearCart();
        
        // NOTIFICAR ÉXITO
        toast({
          title: "¡Pedido Creado Exitosamente!",
          description: `Tu pedido #${response.order.id} ha sido creado. Te enviaremos un email de confirmación.`,
        });
        
        // REDIRIGIR A PÁGINA DE CONFIRMACIÓN
        navigate(`/order-confirmation/${response.order.id}`);
      }
    } catch (error: any) {
      console.error('Error al crear pedido:', error);
      toast({
        title: "Error al Procesar Pedido",
        description: error.message || "Hubo un problema al procesar tu pedido. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // VERIFICAR SI HAY PRODUCTOS FÍSICOS
  const hasPhysicalProducts = summary.items.some(item => item.product.type === 'physical');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BREADCRUMB */}
        <nav className="breadcrumb mb-6">
          <Link href="/" className="hover:text-primary">Inicio</Link>
          <span className="breadcrumb-separator">/</span>
          <Link href="/products" className="hover:text-primary">Productos</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="font-medium">Checkout</span>
        </nav>
        
        {/* TÍTULO */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Finalizar Compra</h1>
          <p className="text-gray-600">Complete su información para procesar el pedido</p>
        </div>
        
        {/* INDICADOR DE PASOS */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 1 ? 'border-primary bg-primary text-white' : 'border-gray-300'
              }`}>
                {currentStep > 1 ? <Check className="h-4 w-4" /> : '1'}
              </div>
              <span className="ml-2 font-medium">Información</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className={`flex items-center ${currentStep >= 2 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 2 ? 'border-primary bg-primary text-white' : 'border-gray-300'
              }`}>
                {currentStep > 2 ? <Check className="h-4 w-4" /> : '2'}
              </div>
              <span className="ml-2 font-medium">Pago</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className={`flex items-center ${currentStep >= 3 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 3 ? 'border-primary bg-primary text-white' : 'border-gray-300'
              }`}>
                3
              </div>
              <span className="ml-2 font-medium">Confirmación</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* FORMULARIO DE CHECKOUT */}
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* INFORMACIÓN PERSONAL */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        1
                      </div>
                      Información Personal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="tu@email.com" 
                              {...field} 
                              className="focus-ring"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre *</FormLabel>
                            <FormControl>
                              <Input placeholder="Juan" {...field} className="focus-ring" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Apellidos *</FormLabel>
                            <FormControl>
                              <Input placeholder="Pérez" {...field} className="focus-ring" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <Input placeholder="+34 600 000 000" {...field} className="focus-ring" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                {/* DIRECCIÓN DE ENVÍO - Solo si hay productos físicos */}
                {hasPhysicalProducts && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                          2
                        </div>
                        Dirección de Envío
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dirección *</FormLabel>
                            <FormControl>
                              <Input placeholder="Calle Mayor 123, 1º A" {...field} className="focus-ring" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ciudad *</FormLabel>
                              <FormControl>
                                <Input placeholder="Madrid" {...field} className="focus-ring" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Código Postal *</FormLabel>
                              <FormControl>
                                <Input placeholder="28001" {...field} className="focus-ring" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>País *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="focus-ring">
                                <SelectValue placeholder="Selecciona un país" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="España">España</SelectItem>
                                <SelectItem value="Portugal">Portugal</SelectItem>
                                <SelectItem value="Francia">Francia</SelectItem>
                                <SelectItem value="Alemania">Alemania</SelectItem>
                                <SelectItem value="Italia">Italia</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                )}
                
                {/* MÉTODO DE PAGO */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {hasPhysicalProducts ? '3' : '2'}
                      </div>
                      Método de Pago
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="card"
                          name="payment"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="focus-ring"
                        />
                        <Label htmlFor="card" className="flex items-center cursor-pointer">
                          <CreditCard className="h-5 w-5 mr-2" />
                          Tarjeta de Crédito/Débito
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="paypal"
                          name="payment"
                          value="paypal"
                          checked={paymentMethod === 'paypal'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="focus-ring"
                        />
                        <Label htmlFor="paypal" className="flex items-center cursor-pointer">
                          <div className="w-5 h-5 bg-blue-600 rounded mr-2 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">P</span>
                          </div>
                          PayPal
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="transfer"
                          name="payment"
                          value="transfer"
                          checked={paymentMethod === 'transfer'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="focus-ring"
                        />
                        <Label htmlFor="transfer" className="flex items-center cursor-pointer">
                          <div className="w-5 h-5 bg-green-600 rounded mr-2 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">T</span>
                          </div>
                          Transferencia Bancaria
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* TÉRMINOS Y CONDICIONES */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={acceptTerms}
                        onCheckedChange={setAcceptTerms}
                        className="mt-1"
                      />
                      <Label htmlFor="terms" className="text-sm cursor-pointer">
                        Acepto los{' '}
                        <Link href="/terms" className="text-primary hover:underline">
                          términos y condiciones
                        </Link>
                        {' '}y la{' '}
                        <Link href="/privacy" className="text-primary hover:underline">
                          política de privacidad
                        </Link>
                      </Label>
                    </div>
                  </CardContent>
                </Card>
                
                {/* BOTÓN DE ENVÍO */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isProcessing || !acceptTerms}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Procesando Pedido...
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5 mr-2" />
                      Finalizar Compra - {formatPrice(summary.total)}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
          
          {/* RESUMEN DEL PEDIDO */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Resumen del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* PRODUCTOS */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {summary.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={getProductImageUrl(item.product)}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-1">{item.product.name}</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Cantidad: {item.quantity}</span>
                          <span className="font-medium">{formatPrice(item.product.price)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                {/* CÁLCULOS */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatPrice(summary.subtotal)}</span>
                  </div>
                  
                  {hasPhysicalProducts && (
                    <div className="flex justify-between">
                      <span>Envío:</span>
                      <span className="text-secondary font-medium">Gratis</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>IVA (21%):</span>
                    <span>{formatPrice(summary.tax)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>{formatPrice(summary.total)}</span>
                  </div>
                </div>
                
                {/* BENEFICIOS */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center text-sm text-gray-600">
                    <Shield className="h-4 w-4 mr-2 text-primary" />
                    Pago 100% seguro
                  </div>
                  {hasPhysicalProducts && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Truck className="h-4 w-4 mr-2 text-secondary" />
                      Envío gratuito
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <Check className="h-4 w-4 mr-2 text-accent" />
                    Garantía de devolución
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
