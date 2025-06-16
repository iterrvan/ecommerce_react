import React from 'react';
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { CartItem } from './cart-item';
import { formatPrice } from '@/lib/api';
import { Link } from 'wouter';

export function CartSidebar() {
  const { 
    isOpen, 
    closeCart, 
    summary, 
    isLoading, 
    clearCart 
  } = useCart();

  // HANDLER PARA PROCEDER AL CHECKOUT
  const handleCheckout = () => {
    closeCart();
    // La navegación se maneja en el Link
  };

  return (
    <>
      {/* OVERLAY */}
      {isOpen && (
        <div 
          className="cart-overlay"
          onClick={closeCart}
        />
      )}

      {/* SIDEBAR DEL CARRITO */}
      <div 
        className={`cart-sidebar fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 flex flex-col ${
          isOpen ? 'open' : 'closed'
        }`}
      >
        
        {/* HEADER DEL CARRITO */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <h3 className="text-lg font-bold">Carrito de Compras</h3>
            {summary.itemCount > 0 && (
              <Badge variant="secondary">
                {summary.itemCount} {summary.itemCount === 1 ? 'producto' : 'productos'}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeCart}
            className="hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* CONTENIDO DEL CARRITO */}
        <div className="flex-1 overflow-hidden flex flex-col">
          
          {/* LISTA DE PRODUCTOS */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              // Estado de carga
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : summary.itemCount === 0 ? (
              // Carrito vacío
              <div className="text-center py-16">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Tu carrito está vacío
                </h4>
                <p className="text-gray-600 mb-6">
                  Agrega productos para empezar a comprar
                </p>
                <Button onClick={closeCart} className="w-full">
                  Continuar Comprando
                </Button>
              </div>
            ) : (
              // Lista de productos
              <div className="space-y-4">
                {summary.items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
                
                {/* BOTÓN LIMPIAR CARRITO */}
                {summary.itemCount > 1 && (
                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearCart}
                      className="w-full text-destructive hover:text-destructive"
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Limpiar Carrito
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RESUMEN Y CHECKOUT */}
          {summary.itemCount > 0 && (
            <div className="border-t bg-white p-6">
              
              {/* RESUMEN DE PRECIOS */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatPrice(summary.subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Envío:</span>
                  <span className="text-secondary font-medium">Gratis</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>IVA (21%):</span>
                  <span>{formatPrice(summary.tax)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatPrice(summary.total)}</span>
                </div>
              </div>

              {/* BOTONES DE ACCIÓN */}
              <div className="space-y-3">
                <Link href="/checkout" onClick={handleCheckout}>
                  <Button 
                    size="lg" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    ) : null}
                    Proceder al Pago
                  </Button>
                </Link>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={closeCart}
                  className="w-full"
                >
                  Continuar Comprando
                </Button>
              </div>

              {/* INFO ADICIONAL */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    Pago Seguro
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                    Envío Rápido
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
                    30 días Garantía
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
