import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, ShoppingCart, Heart, User, Menu, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/hooks/use-cart';

interface HeaderProps {
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
}

export function Header({ onSearchChange, searchQuery = '' }: HeaderProps) {
  const [location] = useLocation();
  const { toggleCart, summary } = useCart();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ELEMENTOS DE NAVEGACIÓN
  const navigationItems = [
    { href: '/', label: 'Inicio', active: location === '/' },
    { href: '/products', label: 'Productos', active: location === '/products' },
    { href: '/categories', label: 'Categorías', active: location.startsWith('/categories') },
    { href: '/offers', label: 'Ofertas', active: location === '/offers' },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO Y NAVEGACIÓN DESKTOP */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
                ModernShop
              </h1>
            </Link>

            {/* Navegación Desktop - Oculta en móvil */}
            <nav className="hidden md:flex space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-medium transition-colors duration-200 ${
                    item.active 
                      ? 'text-primary border-b-2 border-primary pb-4' 
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* BARRA DE BÚSQUEDA - Oculta en móvil */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg transition-all duration-200 ${
                  isSearchFocused 
                    ? 'ring-2 ring-primary border-primary' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>

          {/* ACCIONES DEL USUARIO */}
          <div className="flex items-center space-x-4">
            
            {/* Botón del carrito */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCart}
              className="relative p-2 text-gray-600 hover:text-primary transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {summary.itemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs cart-badge bg-accent text-accent-foreground"
                >
                  {summary.itemCount}
                </Badge>
              )}
            </Button>

            {/* Botón de favoritos */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex p-2 text-gray-600 hover:text-primary transition-colors"
            >
              <Heart className="h-5 w-5" />
            </Button>

            {/* Botón de usuario */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex p-2 text-gray-600 hover:text-primary transition-colors"
            >
              <User className="h-5 w-5" />
            </Button>

            {/* MENÚ MÓVIL - Solo visible en móvil */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden p-2 text-gray-600"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  
                  {/* Cabecera del menú móvil */}
                  <div className="flex items-center justify-between pb-6 border-b">
                    <h2 className="text-lg font-semibold">ModernShop</h2>
                  </div>

                  {/* Barra de búsqueda móvil */}
                  <div className="py-4">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        className="w-full pl-10 pr-4"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    </div>
                  </div>

                  {/* Navegación móvil */}
                  <nav className="flex-1 py-4 space-y-2">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                          item.active 
                            ? 'bg-primary text-primary-foreground' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>

                  {/* Acciones adicionales móvil */}
                  <div className="border-t pt-4 space-y-2">
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <Heart className="h-4 w-4 mr-2" />
                      Lista de Deseos
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <User className="h-4 w-4 mr-2" />
                      Mi Cuenta
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* BARRA DE BÚSQUEDA MÓVIL - Visible solo en móvil cuando está enfocada */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-10 pr-4"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
        </div>
      </div>
    </header>
  );
}
