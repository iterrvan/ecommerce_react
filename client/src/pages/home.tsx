import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HeroSection } from '@/components/common/hero-section';
import { CategoriesSection } from '@/components/common/categories-section';
import { ProductCard, ProductCardSkeleton } from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import { EcommerceAPI } from '@/lib/api';
import { Link } from 'wouter';
import { ArrowRight, Star, TrendingUp, Zap } from 'lucide-react';

export default function Home() {
  // CONSULTAS DE DATOS
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: () => EcommerceAPI.getCategories(),
  });

  const { data: featuredProducts = [], isLoading: featuredLoading } = useQuery({
    queryKey: ['/api/products', 'featured'],
    queryFn: () => EcommerceAPI.getProducts({ featured: true }),
  });

  const { data: saleProducts = [], isLoading: saleLoading } = useQuery({
    queryKey: ['/api/products', 'sale'],
    queryFn: () => EcommerceAPI.getProducts({ onSale: true }),
  });

  const { data: digitalProducts = [], isLoading: digitalLoading } = useQuery({
    queryKey: ['/api/products', 'digital'],
    queryFn: () => EcommerceAPI.getProducts({ type: 'digital' }),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* SECCIÓN HERO */}
      <HeroSection />
      
      {/* SECCIÓN DE CATEGORÍAS */}
      <CategoriesSection 
        categories={categories}
        isLoading={categoriesLoading}
      />
      
      {/* SECCIÓN DE PRODUCTOS DESTACADOS */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Star className="h-6 w-6 text-accent mr-2" />
              <h2 className="text-3xl font-bold text-gray-900">Productos Destacados</h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubre nuestra selección de productos más populares y mejor valorados
            </p>
          </div>
          
          {/* GRID DE PRODUCTOS DESTACADOS */}
          <div className="product-grid mb-8">
            {featuredLoading ? (
              // Skeleton loading para productos destacados
              Array.from({ length: 6 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            ) : (
              featuredProducts.slice(0, 6).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="animate-fade-in-up"
                />
              ))
            )}
          </div>
          
          {/* BOTÓN VER MÁS */}
          <div className="text-center">
            <Link href="/products?featured=true">
              <Button size="lg" className="btn-primary">
                Ver Todos los Destacados
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* SECCIÓN DE OFERTAS */}
      <section className="py-16 bg-gradient-to-r from-accent/10 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-accent mr-2" />
              <h2 className="text-3xl font-bold text-gray-900">Ofertas Especiales</h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Aprovecha nuestras ofertas limitadas con descuentos increíbles
            </p>
          </div>
          
          {/* GRID DE PRODUCTOS EN OFERTA */}
          <div className="product-grid mb-8">
            {saleLoading ? (
              // Skeleton loading para ofertas
              Array.from({ length: 4 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            ) : (
              saleProducts.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="animate-fade-in-up"
                />
              ))
            )}
          </div>
          
          {/* BOTÓN VER MÁS OFERTAS */}
          <div className="text-center">
            <Link href="/offers">
              <Button size="lg" variant="outline" className="btn-outline">
                Ver Todas las Ofertas
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* SECCIÓN DE PRODUCTOS DIGITALES */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-3xl font-bold text-gray-900">Productos Digitales</h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descarga instantánea de cursos, software y recursos digitales
            </p>
          </div>
          
          {/* GRID DE PRODUCTOS DIGITALES */}
          <div className="product-grid mb-8">
            {digitalLoading ? (
              // Skeleton loading para digitales
              Array.from({ length: 4 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            ) : (
              digitalProducts.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="animate-fade-in-up"
                />
              ))
            )}
          </div>
          
          {/* BOTÓN VER MÁS DIGITALES */}
          <div className="text-center">
            <Link href="/products?type=digital">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Ver Productos Digitales
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* SECCIÓN DE CARACTERÍSTICAS */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* ENVÍO GRATIS */}
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Envío Gratis</h3>
              <p className="text-gray-600">En pedidos superiores a €50. Entrega rápida y segura</p>
            </div>
            
            {/* GARANTÍA DE CALIDAD */}
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Garantía de Calidad</h3>
              <p className="text-gray-600">30 días de garantía en todos nuestros productos</p>
            </div>
            
            {/* SOPORTE 24/7 */}
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Soporte 24/7</h3>
              <p className="text-gray-600">Atención al cliente disponible las 24 horas</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
