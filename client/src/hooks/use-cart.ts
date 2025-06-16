import { useContext } from 'react';
import { useCart as useCartContext } from '@/contexts/cart-context';

// RE-EXPORTAR EL HOOK DEL CONTEXTO PARA MANTENER CONSISTENCIA
export const useCart = useCartContext;

// HOOK PERSONALIZADO PARA ESTADÍSTICAS DEL CARRITO
export function useCartStats() {
  const { summary } = useCart();
  
  return {
    itemCount: summary.itemCount,
    subtotal: summary.subtotal,
    tax: summary.tax,
    total: summary.total,
    isEmpty: summary.itemCount === 0,
    hasItems: summary.itemCount > 0,
  };
}

// HOOK PARA OBTENER INFORMACIÓN DE UN PRODUCTO ESPECÍFICO EN EL CARRITO
export function useCartProduct(productId: number) {
  const { items } = useCart();
  
  const cartItem = items.find(item => item.product.id === productId);
  
  return {
    isInCart: !!cartItem,
    quantity: cartItem?.quantity || 0,
    cartItem,
  };
}

// HOOK PARA VALIDACIONES DEL CARRITO
export function useCartValidation() {
  const { items, summary } = useCart();
  
  const hasPhysicalProducts = items.some(item => item.product.type === 'physical');
  const hasDigitalProducts = items.some(item => item.product.type === 'digital');
  const hasOutOfStockItems = items.some(item => 
    !item.product.inStock || 
    (item.product.stockQuantity !== null && item.product.stockQuantity < item.quantity)
  );
  
  return {
    canCheckout: summary.itemCount > 0 && !hasOutOfStockItems,
    hasPhysicalProducts,
    hasDigitalProducts,
    hasOutOfStockItems,
    needsShipping: hasPhysicalProducts,
    validationErrors: {
      empty: summary.itemCount === 0,
      outOfStock: hasOutOfStockItems,
    }
  };
}

// HOOK PARA FUNCIONES DE UTILIDAD DEL CARRITO
export function useCartUtils() {
  const { addToCart, updateQuantity, removeItem } = useCart();
  
  // Incrementar cantidad de un producto
  const incrementQuantity = async (itemId: number, currentQuantity: number) => {
    await updateQuantity(itemId, currentQuantity + 1);
  };
  
  // Decrementar cantidad de un producto
  const decrementQuantity = async (itemId: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      await updateQuantity(itemId, currentQuantity - 1);
    } else {
      await removeItem(itemId);
    }
  };
  
  // Añadir múltiples productos al carrito
  const addMultipleToCart = async (products: Array<{ productId: number; quantity: number }>) => {
    for (const product of products) {
      await addToCart(product.productId, product.quantity);
    }
  };
  
  return {
    incrementQuantity,
    decrementQuantity,
    addMultipleToCart,
  };
}
