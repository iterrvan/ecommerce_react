import React from 'react';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Package, Download, Smartphone, Shirt, Home, Dumbbell, Book, Laptop } from 'lucide-react';
import type { Category } from '@/types';

interface CategoriesSectionProps {
  categories: Category[];
  isLoading?: boolean;
}

export function CategoriesSection({ categories, isLoading }: CategoriesSectionProps) {
  
  // ICONOS PARA CATEGORÍAS
  const getIconForCategory = (iconClass: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'fas fa-laptop': <Laptop className="h-8 w-8" />,
      'fas fa-tshirt': <Shirt className="h-8 w-8" />,
      'fas fa-home': <Home className="h-8 w-8" />,
      'fas fa-download': <Download className="h-8 w-8" />,
      'fas fa-dumbbell': <Dumbbell className="h-8 w-8" />,
      'fas fa-book': <Book className="h-8 w-8" />,
      'fas fa-mobile': <Smartphone className="h-8 w-8" />,
    };
    
    return iconMap[iconClass] || <Package className="h-8 w-8" />;
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEAD SECTION */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explora por Categorías
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encuentra exactamente lo que buscas navegando por nuestras categorías organizadas
          </p>
        </div>
        
        {/* GRID DE CATEGORÍAS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {isLoading ? (
            // Skeleton loading
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  </CardContent>
                </Card>
              </div>
            ))
          ) : (
            categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/products?category=${encodeURIComponent(category.name)}`}
              >
                <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    
                    {/* ICONO DE LA CATEGORÍA */}
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <div className="text-primary group-hover:text-white transition-colors duration-300">
                        {getIconForCategory(category.icon)}
                      </div>
                    </div>
                    
                    {/* NOMBRE DE LA CATEGORÍA */}
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                      {category.name}
                    </h3>
                    
                    {/* CONTADOR DE PRODUCTOS */}
                    <div className="flex items-center justify-center">
                      <Badge 
                        variant="outline" 
                        className="text-xs group-hover:border-primary group-hover:text-primary transition-colors duration-300"
                      >
                        {category.productCount} productos
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
        
        {/* BOTÓN VER TODAS LAS CATEGORÍAS */}
        <div className="text-center mt-12">
          <Link href="/products">
            <Card className="inline-block cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center">
                  <ArrowRight className="h-8 w-8 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Ver Todos los Productos
                  </h3>
                  <p className="text-sm text-gray-600">
                    Explora nuestro catálogo completo
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
        
        {/* SECCIÓN DE TIPOS DE PRODUCTOS */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* PRODUCTOS FÍSICOS */}
          <Link href="/products?type=physical">
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                    <Package className="h-8 w-8 text-secondary group-hover:text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-secondary transition-colors">
                      Productos Físicos
                    </h3>
                    <p className="text-gray-600 mb-3">
                      Electrónicos, moda, hogar y más con envío rápido
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>Envío gratis en pedidos +€50</span>
                    </div>
                  </div>
                  <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-secondary transition-colors" />
                </div>
              </CardContent>
            </Card>
          </Link>
          
          {/* PRODUCTOS DIGITALES */}
          <Link href="/products?type=digital">
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-300">
                    <Download className="h-8 w-8 text-accent group-hover:text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-accent transition-colors">
                      Productos Digitales
                    </h3>
                    <p className="text-gray-600 mb-3">
                      Cursos, software, plantillas y recursos digitales
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>Descarga inmediata disponible</span>
                    </div>
                  </div>
                  <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-accent transition-colors" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
}

// COMPONENTE SKELETON PARA CARGA
export function CategoriesSectionSkeleton() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
