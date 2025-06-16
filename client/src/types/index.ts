// Re-exportar todos los tipos del schema compartido
export type {
  Category,
  Product,
  ProductWithCategory,
  CartItem,
  CartItemWithProduct,
  CartSummary,
  Order,
} from "@shared/schema";

// TIPOS ESPECÍFICOS DEL FRONTEND

// Filtros de productos para la interfaz
export interface ProductFilters {
  category?: string;
  type?: 'physical' | 'digital';
  search?: string;
  featured?: boolean;
  onSale?: boolean;
  priceMin?: number;
  priceMax?: number;
  brands?: string[];
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'rating';
}

// Estado del carrito en el contexto
export interface CartState {
  isOpen: boolean;
  items: CartItemWithProduct[];
  summary: CartSummary;
  isLoading: boolean;
  error: string | null;
}

// Acciones del carrito
export interface CartActions {
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

// Datos del formulario de checkout
export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

// Respuesta de la API
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  errors?: any[];
}

// Estado de carga genérico
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Configuración de paginación
export interface PaginationConfig {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Opciones de ordenamiento
export interface SortOption {
  value: string;
  label: string;
}

// Configuración de vista de productos
export interface ViewConfig {
  layout: 'grid' | 'list';
  itemsPerPage: number;
}
