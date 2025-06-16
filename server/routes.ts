import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema, insertOrderSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // RUTAS DE CATEGORÍAS
  // GET /api/categories - Obtener todas las categorías
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener categorías" });
    }
  });

  // GET /api/categories/:slug - Obtener categoría por slug
  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Categoría no encontrada" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener categoría" });
    }
  });

  // RUTAS DE PRODUCTOS
  // GET /api/products - Obtener productos con filtros opcionales
  app.get("/api/products", async (req, res) => {
    try {
      const {
        category,
        type,
        search,
        featured,
        onSale,
        priceMin,
        priceMax,
        brands
      } = req.query;

      const filters: any = {};
      
      if (category) filters.category = category as string;
      if (type) filters.type = type as 'physical' | 'digital';
      if (search) filters.search = search as string;
      if (featured) filters.featured = featured === 'true';
      if (onSale) filters.onSale = onSale === 'true';
      if (priceMin) filters.priceMin = parseFloat(priceMin as string);
      if (priceMax) filters.priceMax = parseFloat(priceMax as string);
      if (brands) {
        filters.brands = Array.isArray(brands) ? brands : [brands];
      }

      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener productos" });
    }
  });

  // GET /api/products/:id - Obtener producto por ID
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID de producto inválido" });
      }

      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener producto" });
    }
  });

  // GET /api/products/slug/:slug - Obtener producto por slug
  app.get("/api/products/slug/:slug", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener producto" });
    }
  });

  // RUTAS DEL CARRITO
  // Middleware para obtener o crear session ID
  const getSessionId = (req: any) => {
    if (!req.session.cartId) {
      req.session.cartId = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    return req.session.cartId;
  };

  // GET /api/cart - Obtener items del carrito
  app.get("/api/cart", async (req, res) => {
    try {
      const sessionId = getSessionId(req);
      const summary = await storage.getCartSummary(sessionId);
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener carrito" });
    }
  });

  // POST /api/cart - Añadir producto al carrito
  app.post("/api/cart", async (req, res) => {
    try {
      const sessionId = getSessionId(req);
      
      const validation = insertCartItemSchema.safeParse({
        ...req.body,
        sessionId,
      });

      if (!validation.success) {
        return res.status(400).json({ 
          message: "Datos inválidos",
          errors: validation.error.errors 
        });
      }

      // Verificar que el producto existe
      const product = await storage.getProductById(validation.data.productId);
      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      // Verificar stock para productos físicos
      if (product.type === 'physical' && product.stockQuantity !== null) {
        const quantity = validation.data.quantity ?? 1;
        if (product.stockQuantity < quantity) {
          return res.status(400).json({ 
            message: "Stock insuficiente",
            available: product.stockQuantity 
          });
        }
      }

      const cartItem = await storage.addToCart(validation.data);
      const summary = await storage.getCartSummary(sessionId);
      
      res.json({
        item: cartItem,
        summary,
        message: "Producto añadido al carrito"
      });
    } catch (error) {
      res.status(500).json({ message: "Error al añadir producto al carrito" });
    }
  });

  // PUT /api/cart/:id - Actualizar cantidad de item del carrito
  app.put("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;

      if (isNaN(id) || !quantity || quantity < 0) {
        return res.status(400).json({ message: "Datos inválidos" });
      }

      const updatedItem = await storage.updateCartItem(id, quantity);
      const sessionId = getSessionId(req);
      const summary = await storage.getCartSummary(sessionId);

      res.json({
        item: updatedItem,
        summary,
        message: quantity === 0 ? "Producto eliminado del carrito" : "Carrito actualizado"
      });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar carrito" });
    }
  });

  // DELETE /api/cart/:id - Eliminar item del carrito
  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const removed = await storage.removeFromCart(id);
      if (!removed) {
        return res.status(404).json({ message: "Item no encontrado" });
      }

      const sessionId = getSessionId(req);
      const summary = await storage.getCartSummary(sessionId);

      res.json({
        summary,
        message: "Producto eliminado del carrito"
      });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar producto del carrito" });
    }
  });

  // DELETE /api/cart - Limpiar carrito completo
  app.delete("/api/cart", async (req, res) => {
    try {
      const sessionId = getSessionId(req);
      await storage.clearCart(sessionId);
      
      res.json({
        message: "Carrito limpiado"
      });
    } catch (error) {
      res.status(500).json({ message: "Error al limpiar carrito" });
    }
  });

  // RUTAS DE PEDIDOS
  // POST /api/orders - Crear nuevo pedido
  app.post("/api/orders", async (req, res) => {
    try {
      const sessionId = getSessionId(req);
      
      // Obtener resumen del carrito
      const cartSummary = await storage.getCartSummary(sessionId);
      if (cartSummary.itemCount === 0) {
        return res.status(400).json({ message: "El carrito está vacío" });
      }

      const validation = insertOrderSchema.safeParse({
        ...req.body,
        sessionId,
        subtotal: cartSummary.subtotal.toString(),
        tax: cartSummary.tax.toString(),
        total: cartSummary.total.toString(),
      });

      if (!validation.success) {
        return res.status(400).json({ 
          message: "Datos inválidos",
          errors: validation.error.errors 
        });
      }

      const order = await storage.createOrder(validation.data);
      
      // Limpiar carrito después de crear el pedido
      await storage.clearCart(sessionId);

      res.json({
        order,
        message: "Pedido creado exitosamente"
      });
    } catch (error) {
      res.status(500).json({ message: "Error al crear pedido" });
    }
  });

  // GET /api/orders/:id - Obtener pedido por ID
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID de pedido inválido" });
      }

      const order = await storage.getOrderById(id);
      if (!order) {
        return res.status(404).json({ message: "Pedido no encontrado" });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener pedido" });
    }
  });

  // RUTA DE SALUD DEL API
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok",
      message: "ModernShop E-commerce API funcionando correctamente",
      timestamp: new Date().toISOString()
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
