import React, { useState } from 'react';
import { Plus, Minus, Trash2, Download, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { formatPrice, getProductImageUrl } from '@/lib/api';
import type { CartItemWithProduct } from '@/types';

interface CartItemProps {
  item: CartItemWithProduct;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem, isLoading } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  // HANDLERS
  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemove();
      return;
    }

    setIsUpdating(true);
    try {
      await updateQuantity(item.id, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await removeItem(item.id);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleIncrement = () => {
    const maxQuantity = item.product.stockQuantity;
    if (maxQuantity && item.quantity >= maxQuantity) {
      return; // No incrementar si ya está en el máximo
    }
    handleQuantityChange(item.quantity + 1);
  };

  const handleDecrement = () => {
    handleQuantityChange(item.quantity - 1);
  };

  // CÁLCULOS
  const imageUrl = getProductImageUrl(item.product);
  const itemTotal = parseFloat(item.product.price) * item.quantity;
  const isPhysical = item.product.type === 'physical';
  const isDigital = item.product.type === 'digital';

  return (
    <div className="flex items-start space-x-4 p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
      
      {/* IMAGEN DEL PRODUCTO */}
      <div className="relative flex-shrink-0">
        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
          {isDigital ? (
            // Icono para productos digitales
            <div className="w-full h-full bg-accent/10 flex items-center justify-center">
              <Download className="h-8 w-8 text-accent" />
            </div>
          ) : (
            // Imagen para productos físicos
            <img
              src={imageUrl}
              alt={item.product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
        </div>
        
        {/* BADGE DE TIPO */}
        <div className="absolute -top-1 -right-1">
          <Badge
            className={`text-xs px-1 py-0 ${
              isPhysical ? 'badge-physical' : 'badge-digital'
            }`}
          >
            {isPhysical ? (
              <Package className="h-2 w-2" />
            ) : (
              <Download className="h-2 w-2" />
            )}
          </Badge>
        </div>
      </div>

      {/* INFORMACIÓN DEL PRODUCTO */}
      <div className="flex-1 min-w-0">
        
        {/* NOMBRE Y TIPO */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-sm line-clamp-2 mb-1">
              {item.product.name}
            </h4>
            <p className="text-xs text-gray-500 mb-2">
              {isPhysical ? 'Producto Físico' : 'Producto Digital'}
              {item.product.brand && ` • ${item.product.brand}`}
            </p>
          </div>
          
          {/* BOTÓN ELIMINAR */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={isUpdating || isLoading}
            className="h-8 w-8 text-gray-400 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* PRECIO Y CONTROLES */}
        <div className="flex items-center justify-between mt-2">
          
          {/* PRECIO */}
          <div className="flex flex-col">
            <span className="font-bold text-sm">
              {formatPrice(itemTotal)}
            </span>
            {item.quantity > 1 && (
              <span className="text-xs text-gray-500">
                {formatPrice(item.product.price)} c/u
              </span>
            )}
          </div>

          {/* CONTROLES DE CANTIDAD */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDecrement}
              disabled={isUpdating || isLoading || item.quantity <= 1}
              className="h-8 w-8"
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <span className="px-3 py-1 bg-gray-50 rounded text-sm font-medium min-w-[2rem] text-center">
              {isUpdating ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400 mx-auto" />
              ) : (
                item.quantity
              )}
            </span>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleIncrement}
              disabled={
                isUpdating || 
                isLoading || 
                (item.product.stockQuantity !== null && item.quantity >= item.product.stockQuantity)
              }
              className="h-8 w-8"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* INFORMACIÓN ADICIONAL */}
        <div className="mt-2 flex items-center justify-between">
          
          {/* ESTADO DE STOCK (solo para productos físicos) */}
          {isPhysical && (
            <div className="flex items-center space-x-2">
              {item.product.inStock ? (
                <div className="flex items-center text-xs text-secondary">
                  <div className="w-2 h-2 bg-secondary rounded-full mr-1"></div>
                  En stock
                </div>
              ) : (
                <div className="flex items-center text-xs text-destructive">
                  <div className="w-2 h-2 bg-destructive rounded-full mr-1"></div>
                  Sin stock
                </div>
              )}
              
              {item.product.stockQuantity !== null && item.product.stockQuantity <= 5 && (
                <span className="text-xs text-orange-600">
                  Solo {item.product.stockQuantity} disponibles
                </span>
              )}
            </div>
          )}
          
          {/* INFO DIGITAL */}
          {isDigital && (
            <div className="flex items-center text-xs text-accent">
              <Download className="h-3 w-3 mr-1" />
              Descarga inmediata
            </div>
          )}
        </div>

        {/* MENSAJE DE ENVÍO GRATIS */}
        {isPhysical && parseFloat(item.product.price) >= 50 && (
          <div className="mt-1 text-xs text-secondary font-medium">
            ✓ Envío gratuito
          </div>
        )}
      </div>
    </div>
  );
}

// COMPONENTE SKELETON PARA CARGA
export function CartItemSkeleton() {
  return (
    <div className="flex items-start space-x-4 p-4 border rounded-lg bg-white">
      <div className="animate-pulse">
        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="flex-1 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="w-8 h-6 bg-gray-200 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
