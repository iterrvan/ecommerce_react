import { 
  categories, products, cartItems, orders,
  type Category, type InsertCategory,
  type Product, type InsertProduct, type ProductWithCategory,
  type CartItem, type InsertCartItem, type CartItemWithProduct,
  type Order, type InsertOrder, type CartSummary
} from "@shared/schema";

// INTERFAZ DE ALMACENAMIENTO PARA OPERACIONES CRUD
export interface IStorage {
  // Operaciones de Categorías
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Operaciones de Productos
  getProducts(filters?: {
    category?: string;
    type?: 'physical' | 'digital';
    search?: string;
    featured?: boolean;
    onSale?: boolean;
    priceMin?: number;
    priceMax?: number;
    brands?: string[];
  }): Promise<ProductWithCategory[]>;
  getProductById(id: number): Promise<ProductWithCategory | undefined>;
  getProductBySlug(slug: string): Promise<ProductWithCategory | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;

  // Operaciones del Carrito
  getCartItems(sessionId: string): Promise<CartItemWithProduct[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
  getCartSummary(sessionId: string): Promise<CartSummary>;

  // Operaciones de Pedidos
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderById(id: number): Promise<Order | undefined>;
}

// IMPLEMENTACIÓN EN MEMORIA PARA DESARROLLO
export class MemStorage implements IStorage {
  private categories: Map<number, Category> = new Map();
  private products: Map<number, Product> = new Map();
  private cartItems: Map<number, CartItem> = new Map();
  private orders: Map<number, Order> = new Map();
  
  private categoryId = 1;
  private productId = 1;
  private cartItemId = 1;
  private orderId = 1;

  constructor() {
    this.initializeData();
  }

  // INICIALIZAR DATOS DE EJEMPLO PARA DESARROLLO
  private initializeData() {
    // Categorías
    const categoriesData = [
      { name: "Electrónicos", slug: "electronicos", icon: "fas fa-laptop", productCount: 245 },
      { name: "Moda", slug: "moda", icon: "fas fa-tshirt", productCount: 189 },
      { name: "Hogar", slug: "hogar", icon: "fas fa-home", productCount: 156 },
      { name: "Digitales", slug: "digitales", icon: "fas fa-download", productCount: 87 },
      { name: "Deportes", slug: "deportes", icon: "fas fa-dumbbell", productCount: 203 },
      { name: "Libros", slug: "libros", icon: "fas fa-book", productCount: 134 },
    ];

    categoriesData.forEach(cat => {
      const category: Category = { id: this.categoryId++, ...cat };
      this.categories.set(category.id, category);
    });

    // Productos
    const productsData = [
      {
        name: "MacBook Pro 14\"",
        slug: "macbook-pro-14",
        description: "Chip M2, 16GB RAM, 512GB SSD",
        price: "2199.00",
        originalPrice: "2499.00",
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "Electrónicos",
        categoryId: 1,
        brand: "Apple",
        type: "physical" as const,
        inStock: true,
        stockQuantity: 15,
        rating: "4.8",
        reviewCount: 234,
        isFeatured: true,
        isOnSale: true,
        tags: ["laptop", "apple", "m2"],
      },
      {
        name: "Curso Completo de Vue.js",
        slug: "curso-vue-js",
        description: "Aprende Vue 3 desde cero hasta nivel avanzado",
        price: "79.00",
        originalPrice: "149.00",
        images: ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "Digitales",
        categoryId: 4,
        brand: "EduTech",
        type: "digital" as const,
        inStock: true,
        stockQuantity: 999,
        rating: "4.6",
        reviewCount: 1843,
        isFeatured: true,
        isOnSale: true,
        tags: ["curso", "programacion", "vue"],
        downloadUrl: "/downloads/vue-course.zip",
      },
      {
        name: "Sony WH-1000XM4",
        slug: "sony-wh-1000xm4",
        description: "Auriculares inalámbricos con cancelación de ruido",
        price: "299.00",
        images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "Electrónicos",
        categoryId: 1,
        brand: "Sony",
        type: "physical" as const,
        inStock: true,
        stockQuantity: 28,
        rating: "4.9",
        reviewCount: 2156,
        isFeatured: false,
        isOnSale: false,
        tags: ["auriculares", "sony", "bluetooth"],
      },
      {
        name: "Pack Plantillas UI/UX",
        slug: "plantillas-ui-ux",
        description: "50+ plantillas modernas para tus proyectos",
        price: "45.00",
        originalPrice: "89.00",
        images: ["https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "Digitales",
        categoryId: 4,
        brand: "DesignHub",
        type: "digital" as const,
        inStock: true,
        stockQuantity: 999,
        rating: "4.7",
        reviewCount: 892,
        isFeatured: false,
        isOnSale: true,
        tags: ["diseño", "plantillas", "ui-ux"],
        downloadUrl: "/downloads/ui-templates.zip",
      },
      {
        name: "iPhone 15 Pro",
        slug: "iphone-15-pro",
        description: "Titanio Natural, 128GB",
        price: "1099.00",
        originalPrice: "1199.00",
        images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "Electrónicos",
        categoryId: 1,
        brand: "Apple",
        type: "physical" as const,
        inStock: true,
        stockQuantity: 12,
        rating: "4.8",
        reviewCount: 3421,
        isFeatured: true,
        isOnSale: true,
        tags: ["smartphone", "apple", "iphone"],
      },
      {
        name: "Software de Gestión Pro",
        slug: "software-gestion-pro",
        description: "Licencia de por vida + actualizaciones",
        price: "199.00",
        images: ["https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "Digitales",
        categoryId: 4,
        brand: "BusinessSoft",
        type: "digital" as const,
        inStock: true,
        stockQuantity: 999,
        rating: "4.9",
        reviewCount: 567,
        isFeatured: false,
        isOnSale: false,
        tags: ["software", "gestion", "empresa"],
        downloadUrl: "/downloads/management-software.exe",
      },
    ];

    productsData.forEach(prod => {
      const product: Product = {
        id: this.productId++,
        ...prod,
        createdAt: new Date(),
      };
      this.products.set(product.id, product);
    });
  }

  // OPERACIONES DE CATEGORÍAS
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const newCategory: Category = {
      id: this.categoryId++,
      productCount: 0,
      ...category,
    };
    this.categories.set(newCategory.id, newCategory);
    return newCategory;
  }

  // OPERACIONES DE PRODUCTOS
  async getProducts(filters: {
    category?: string;
    type?: 'physical' | 'digital';
    search?: string;
    featured?: boolean;
    onSale?: boolean;
    priceMin?: number;
    priceMax?: number;
    brands?: string[];
  } = {}): Promise<ProductWithCategory[]> {
    let results = Array.from(this.products.values());

    if (filters.category) {
      results = results.filter(p => p.category.toLowerCase() === filters.category!.toLowerCase());
    }

    if (filters.type) {
      results = results.filter(p => p.type === filters.type);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      results = results.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    if (filters.featured) {
      results = results.filter(p => p.isFeatured);
    }

    if (filters.onSale) {
      results = results.filter(p => p.isOnSale);
    }

    if (filters.priceMin !== undefined) {
      results = results.filter(p => parseFloat(p.price) >= filters.priceMin!);
    }

    if (filters.priceMax !== undefined) {
      results = results.filter(p => parseFloat(p.price) <= filters.priceMax!);
    }

    if (filters.brands && filters.brands.length > 0) {
      results = results.filter(p => p.brand && filters.brands!.includes(p.brand));
    }

    // Añadir datos de categoría
    return results.map(product => ({
      ...product,
      categoryData: this.categories.get(product.categoryId || 0),
    }));
  }

  async getProductById(id: number): Promise<ProductWithCategory | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    return {
      ...product,
      categoryData: this.categories.get(product.categoryId || 0),
    };
  }

  async getProductBySlug(slug: string): Promise<ProductWithCategory | undefined> {
    const product = Array.from(this.products.values()).find(p => p.slug === slug);
    if (!product) return undefined;

    return {
      ...product,
      categoryData: this.categories.get(product.categoryId || 0),
    };
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct: Product = {
      id: this.productId++,
      createdAt: new Date(),
      ...product,
    };
    this.products.set(newProduct.id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  // OPERACIONES DEL CARRITO
  async getCartItems(sessionId: string): Promise<CartItemWithProduct[]> {
    const items = Array.from(this.cartItems.values())
      .filter(item => item.sessionId === sessionId);

    return items.map(item => ({
      ...item,
      product: this.products.get(item.productId)!,
    })).filter(item => item.product);
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    // Verificar si el producto ya está en el carrito
    const existingItem = Array.from(this.cartItems.values())
      .find(cartItem => 
        cartItem.sessionId === item.sessionId && 
        cartItem.productId === item.productId
      );

    if (existingItem) {
      // Actualizar cantidad
      existingItem.quantity += item.quantity;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    }

    // Crear nuevo item
    const newItem: CartItem = {
      id: this.cartItemId++,
      createdAt: new Date(),
      ...item,
    };
    this.cartItems.set(newItem.id, newItem);
    return newItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;

    if (quantity <= 0) {
      this.cartItems.delete(id);
      return undefined;
    }

    item.quantity = quantity;
    this.cartItems.set(id, item);
    return item;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const items = Array.from(this.cartItems.entries())
      .filter(([_, item]) => item.sessionId === sessionId);
    
    items.forEach(([id]) => this.cartItems.delete(id));
    return true;
  }

  async getCartSummary(sessionId: string): Promise<CartSummary> {
    const items = await this.getCartItems(sessionId);
    
    const subtotal = items.reduce((sum, item) => 
      sum + (parseFloat(item.product.price) * item.quantity), 0
    );
    
    const tax = subtotal * 0.21; // 21% IVA
    const total = subtotal + tax;
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
      itemCount,
    };
  }

  // OPERACIONES DE PEDIDOS
  async createOrder(order: InsertOrder): Promise<Order> {
    const newOrder: Order = {
      id: this.orderId++,
      createdAt: new Date(),
      ...order,
    };
    this.orders.set(newOrder.id, newOrder);
    return newOrder;
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
}

export const storage = new MemStorage();
