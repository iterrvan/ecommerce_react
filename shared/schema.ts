import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// TABLA DE CATEGORÍAS
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(), // Clase de icono Font Awesome
  productCount: integer("product_count").notNull().default(0),
});

// TABLA DE PRODUCTOS  
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  images: text("images").array().notNull().default([]), // Array de URLs de imágenes
  category: text("category").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  brand: text("brand"),
  type: text("type").notNull(), // 'physical' o 'digital'
  inStock: boolean("in_stock").notNull().default(true),
  stockQuantity: integer("stock_quantity").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).notNull().default("0"),
  reviewCount: integer("review_count").notNull().default(0),
  isFeatured: boolean("is_featured").notNull().default(false),
  isOnSale: boolean("is_on_sale").notNull().default(false),
  tags: text("tags").array().default([]),
  downloadUrl: text("download_url"), // Para productos digitales
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// TABLA DE ELEMENTOS DEL CARRITO
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(), // Para carritos anónimos
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// TABLA DE PEDIDOS
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull(),
  phone: text("phone"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, shipped, delivered, cancelled
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ESQUEMAS DE VALIDACIÓN CON ZOD
export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  productCount: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

// TIPOS TYPESCRIPT
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

// TIPOS EXTENDIDOS PARA EL FRONTEND
export type ProductWithCategory = Product & {
  categoryData?: Category;
};

export type CartItemWithProduct = CartItem & {
  product: Product;
};

export type CartSummary = {
  items: CartItemWithProduct[];
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
};
