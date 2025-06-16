import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { EcommerceAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import type { CartState, CartActions, CartItemWithProduct, CartSummary } from '@/types';

// TIPOS DEL CONTEXTO
type CartContextType = CartState & CartActions;

// TIPOS DE ACCIONES DEL REDUCER
type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CART_DATA'; payload: CartSummary }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' };

// ESTADO INICIAL DEL CARRITO
const initialState: CartState = {
  isOpen: false,
  items: [],
  summary: {
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    itemCount: 0,
  },
  isLoading: false,
  error: null,
};

// REDUCER DEL CARRITO
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_CART_DATA':
      return {
        ...state,
        items: action.payload.items,
        summary: action.payload,
        isLoading: false,
        error: null,
      };
    
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    
    default:
      return state;
  }
}

// CONTEXTO DEL CARRITO
const CartContext = createContext<CartContextType | undefined>(undefined);

// PROVEEDOR DEL CONTEXTO DEL CARRITO
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { toast } = useToast();

  // CARGAR CARRITO AL INICIAR
  useEffect(() => {
    loadCart();
  }, []);

  // FUNCIÓN PARA CARGAR EL CARRITO
  const loadCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const cartData = await EcommerceAPI.getCart();
      dispatch({ type: 'SET_CART_DATA', payload: cartData });
    } catch (error) {
      console.error('Error al cargar carrito:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error al cargar el carrito' });
    }
  };

  // ACCIONES DEL CARRITO
  const actions: CartActions = {
    // Controles de visibilidad del carrito
    openCart: () => dispatch({ type: 'OPEN_CART' }),
    closeCart: () => dispatch({ type: 'CLOSE_CART' }),
    toggleCart: () => dispatch({ type: 'TOGGLE_CART' }),

    // Añadir producto al carrito
    addToCart: async (productId: number, quantity: number = 1) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await EcommerceAPI.addToCart(productId, quantity);
        
        if (response.summary) {
          dispatch({ type: 'SET_CART_DATA', payload: response.summary });
          toast({
            title: "¡Producto añadido!",
            description: response.message || "El producto se ha añadido al carrito",
          });
        }
      } catch (error: any) {
        console.error('Error al añadir al carrito:', error);
        const errorMessage = error.message || 'Error al añadir producto al carrito';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    },

    // Actualizar cantidad de un producto
    updateQuantity: async (itemId: number, quantity: number) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await EcommerceAPI.updateCartItem(itemId, quantity);
        
        if (response.summary) {
          dispatch({ type: 'SET_CART_DATA', payload: response.summary });
          toast({
            title: "Carrito actualizado",
            description: response.message || "La cantidad se ha actualizado",
          });
        }
      } catch (error: any) {
        console.error('Error al actualizar cantidad:', error);
        const errorMessage = error.message || 'Error al actualizar el carrito';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    },

    // Eliminar producto del carrito
    removeItem: async (itemId: number) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await EcommerceAPI.removeCartItem(itemId);
        
        if (response.summary) {
          dispatch({ type: 'SET_CART_DATA', payload: response.summary });
          toast({
            title: "Producto eliminado",
            description: response.message || "El producto se ha eliminado del carrito",
          });
        }
      } catch (error: any) {
        console.error('Error al eliminar producto:', error);
        const errorMessage = error.message || 'Error al eliminar producto del carrito';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    },

    // Limpiar carrito completo
    clearCart: async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        await EcommerceAPI.clearCart();
        
        // Recargar carrito para obtener estado actualizado
        await loadCart();
        
        toast({
          title: "Carrito limpiado",
          description: "Todos los productos han sido eliminados del carrito",
        });
      } catch (error: any) {
        console.error('Error al limpiar carrito:', error);
        const errorMessage = error.message || 'Error al limpiar el carrito';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    },

    // Refrescar carrito
    refreshCart: loadCart,
  };

  // Valor del contexto
  const contextValue: CartContextType = {
    ...state,
    ...actions,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

// HOOK PERSONALIZADO PARA USAR EL CONTEXTO DEL CARRITO
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}

// HOOK PARA OBTENER EL ESTADO DEL CARRITO SIN ACCIONES
export function useCartState(): CartState {
  const { isOpen, items, summary, isLoading, error } = useCart();
  return { isOpen, items, summary, isLoading, error };
}

// HOOK PARA OBTENER SOLO LAS ACCIONES DEL CARRITO
export function useCartActions(): CartActions {
  const {
    openCart,
    closeCart,
    toggleCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
  } = useCart();

  return {
    openCart,
    closeCart,
    toggleCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
  };
}
