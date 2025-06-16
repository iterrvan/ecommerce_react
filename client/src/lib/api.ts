import { apiRequest } from "./queryClient";
import type {
  Category,
  ProductWithCategory,
  CartSummary,
  Order,
  ProductFilters,
  CheckoutFormData,
  ApiResponse,
} from "@/types";

// CLASE PARA MANEJO DE API E-COMMERCE
export class EcommerceAPI {
  
  // MÉTODOS DE CATEGORÍAS
  static async getCategories(): Promise<Category[]> {
    const response = await apiRequest("GET", "/api/categories");
    return response.json();
  }

  static async getCategoryBySlug(slug: string): Promise<Category> {
    const response = await apiRequest("GET", `/api/categories/${slug}`);
    return response.json();
  }

  // MÉTODOS DE PRODUCTOS
  static async getProducts(filters: ProductFilters = {}): Promise<ProductWithCategory[]> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const queryString = params.toString();
    const url = queryString ? `/api/products?${queryString}` : '/api/products';
    
    const response = await apiRequest("GET", url);
    return response.json();
  }

  static async getProductById(id: number): Promise<ProductWithCategory> {
    const response = await apiRequest("GET", `/api/products/${id}`);
    return response.json();
  }

  static async getProductBySlug(slug: string): Promise<ProductWithCategory> {
    const response = await apiRequest("GET", `/api/products/slug/${slug}`);
    return response.json();
  }

  // MÉTODOS DEL CARRITO
  static async getCart(): Promise<CartSummary> {
    const response = await apiRequest("GET", "/api/cart");
    return response.json();
  }

  static async addToCart(productId: number, quantity: number = 1): Promise<ApiResponse<{ summary: CartSummary }>> {
    const response = await apiRequest("POST", "/api/cart", {
      productId,
      quantity,
    });
    return response.json();
  }

  static async updateCartItem(itemId: number, quantity: number): Promise<ApiResponse<{ summary: CartSummary }>> {
    const response = await apiRequest("PUT", `/api/cart/${itemId}`, {
      quantity,
    });
    return response.json();
  }

  static async removeCartItem(itemId: number): Promise<ApiResponse<{ summary: CartSummary }>> {
    const response = await apiRequest("DELETE", `/api/cart/${itemId}`);
    return response.json();
  }

  static async clearCart(): Promise<ApiResponse> {
    const response = await apiRequest("DELETE", "/api/cart");
    return response.json();
  }

  // MÉTODOS DE PEDIDOS
  static async createOrder(orderData: CheckoutFormData): Promise<ApiResponse<{ order: Order }>> {
    const response = await apiRequest("POST", "/api/orders", orderData);
    return response.json();
  }

  static async getOrderById(id: number): Promise<Order> {
    const response = await apiRequest("GET", `/api/orders/${id}`);
    return response.json();
  }

  // MÉTODO DE SALUD DEL API
  static async checkHealth(): Promise<{ status: string; message: string; timestamp: string }> {
    const response = await apiRequest("GET", "/api/health");
    return response.json();
  }
}

// FUNCIONES DE UTILIDAD PARA FORMATEO
export const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numPrice);
};

export const formatRating = (rating: string | number): number => {
  return typeof rating === 'string' ? parseFloat(rating) : rating;
};

export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const getProductImageUrl = (product: ProductWithCategory, index: number = 0): string => {
  if (product.images && product.images.length > index) {
    return product.images[index];
  }
  // Imagen placeholder basada en el tipo de producto
  if (product.type === 'digital') {
    return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300';
  }
  return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300';
};

export const isProductOnSale = (product: ProductWithCategory): boolean => {
  return product.isOnSale && !!product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price);
};

export const calculateDiscount = (product: ProductWithCategory): number => {
  if (!product.originalPrice) return 0;
  const original = parseFloat(product.originalPrice);
  const current = parseFloat(product.price);
  return Math.round(((original - current) / original) * 100);
};

export const getStockStatus = (product: ProductWithCategory): 'in-stock' | 'low-stock' | 'out-of-stock' => {
  if (!product.inStock || (product.stockQuantity !== null && product.stockQuantity <= 0)) {
    return 'out-of-stock';
  }
  if (product.stockQuantity !== null && product.stockQuantity <= 5) {
    return 'low-stock';
  }
  return 'in-stock';
};

// CONSTANTES DE CONFIGURACIÓN
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Más Recientes' },
  { value: 'price-asc', label: 'Precio: Menor a Mayor' },
  { value: 'price-desc', label: 'Precio: Mayor a Menor' },
  { value: 'popular', label: 'Más Populares' },
  { value: 'rating', label: 'Mejor Valorados' },
];

export const PRODUCT_TYPES = [
  { value: 'physical', label: 'Productos Físicos' },
  { value: 'digital', label: 'Productos Digitales' },
];

export const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48];

export const DEFAULT_FILTERS: ProductFilters = {
  sortBy: 'newest',
};
