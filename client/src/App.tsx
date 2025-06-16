import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/cart-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartSidebar } from "@/components/cart/cart-sidebar";

// IMPORTAR PÁGINAS
import Home from "@/pages/home";
import Products from "@/pages/products";
import ProductDetail from "@/pages/product-detail";
import Checkout from "@/pages/checkout";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* PÁGINA PRINCIPAL */}
      <Route path="/" component={Home} />
      
      {/* PÁGINAS DE PRODUCTOS */}
      <Route path="/products" component={Products} />
      <Route path="/products/:slug" component={ProductDetail} />
      
      {/* PÁGINA DE CHECKOUT */}
      <Route path="/checkout" component={Checkout} />
      
      {/* PÁGINAS ADICIONALES */}
      <Route path="/categories" component={Products} />
      <Route path="/categories/:category" component={Products} />
      <Route path="/offers" component={Products} />
      
      {/* PÁGINA 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <div className="main-layout">
            {/* HEADER GLOBAL */}
            <Header />
            
            {/* CONTENIDO PRINCIPAL */}
            <main className="content-wrapper">
              <Router />
            </main>
            
            {/* FOOTER GLOBAL */}
            <Footer />
            
            {/* CARRITO LATERAL */}
            <CartSidebar />
            
            {/* NOTIFICACIONES */}
            <Toaster />
          </div>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
