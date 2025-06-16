import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useSearch } from 'wouter';
import { ProductCard, ProductCardSkeleton } from '@/components/products/product-card';
import { ProductFilters } from '@/components/products/product-filters';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { EcommerceAPI, SORT_OPTIONS } from '@/lib/api';
import { Grid, List, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProductFilters as ProductFiltersType } from '@/types';

export default function Products() {
  const [location] = useLocation();
  const searchParams = useSearch();
  
  // ESTADO LOCAL
  const [filters, setFilters] = useState<ProductFiltersType>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 12;

  // INICIALIZAR FILTROS DESDE URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const initialFilters: ProductFiltersType = {};
    
    if (params.get('category')) initialFilters.category = params.get('category')!;
    if (params.get('type')) initialFilters.type = params.get('type') as 'physical' | 'digital';
    if (params.get('search')) initialFilters.search = params.get('search')!;
    if (params.get('featured')) initialFilters.featured = params.get('featured') === 'true';
    if (params.get('onSale')) initialFilters.onSale = params.get('onSale') === 'true';
    if (params.get('sortBy')) initialFilters.sortBy = params.get('sortBy') as any;
    
    setFilters(initialFilters);
  }, [searchParams]);

  // CONSULTAS DE DATOS
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: () => EcommerceAPI.getCategories(),
  });

  const { data: allProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products', filters],
    queryFn: () => EcommerceAPI.getProducts(filters),
  });

  // PROCESAMIENTO DE DATOS
  const availableBrands = Array.from(
    new Set(allProducts.map(p => p.brand).filter(Boolean))
  ) as string[];

  const priceRange = {
    min: Math.min(...allProducts.map(p => parseFloat(p.price)), 0),
    max: Math.max(...allProducts.map(p => parseFloat(p.price)), 1000),
  };

  // APLICAR ORDENAMIENTO
  const sortedProducts = [...allProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-asc':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-desc':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'rating':
        return parseFloat(b.rating) - parseFloat(a.rating);
      case 'popular':
        return b.reviewCount - a.reviewCount;
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // PAGINACIÓN
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  // HANDLERS
  const handleFiltersChange = (newFilters: ProductFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset página al cambiar filtros
  };

  const handleSortChange = (sortBy: string) => {
    setFilters(prev => ({ ...prev, sortBy: sortBy as any }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // CONTAR FILTROS ACTIVOS
  const activeFiltersCount = Object.values(filters).filter(v => 
    v !== undefined && v !== null && v !== '' && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* BREADCRUMB */}
        <nav className="breadcrumb mb-6">
          <span>Inicio</span>
          <span className="breadcrumb-separator">/</span>
          <span className="font-medium">
            {filters.category ? filters.category : 'Productos'}
          </span>
        </nav>
        
        {/* HEADER DE LA PÁGINA */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {filters.category ? `Categoría: ${filters.category}` : 'Todos los Productos'}
            {filters.type && (
              <Badge className="ml-3">
                {filters.type === 'physical' ? 'Físicos' : 'Digitales'}
              </Badge>
            )}
          </h1>
          <p className="text-lg text-gray-600">
            Descubre nuestra amplia selección de productos de alta calidad
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR DE FILTROS - Desktop */}
          <div className="lg:w-1/4 hidden lg:block">
            <ProductFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              categories={categories}
              availableBrands={availableBrands}
              priceRange={priceRange}
              isLoading={productsLoading}
            />
          </div>
          
          {/* CONTENIDO PRINCIPAL */}
          <div className="lg:w-3/4">
            
            {/* BARRA DE HERRAMIENTAS */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              
              {/* INFO DE RESULTADOS */}
              <div className="flex items-center space-x-4">
                <p className="text-gray-600">
                  {productsLoading ? (
                    'Cargando...'
                  ) : (
                    `Mostrando ${startIndex + 1}-${Math.min(startIndex + itemsPerPage, sortedProducts.length)} de ${sortedProducts.length} productos`
                  )}
                </p>
                
                {/* FILTROS ACTIVOS - Móvil */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-2">{activeFiltersCount}</Badge>
                  )}
                </Button>
              </div>
              
              {/* CONTROLES DE VISTA Y ORDENAMIENTO */}
              <div className="flex items-center space-x-4">
                
                {/* SELECTOR DE ORDENAMIENTO */}
                <Select value={filters.sortBy || 'newest'} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* SELECTOR DE VISTA */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* PANEL DE FILTROS MÓVIL */}
            {showFilters && (
              <div className="lg:hidden mb-6">
                <ProductFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  categories={categories}
                  availableBrands={availableBrands}
                  priceRange={priceRange}
                  isLoading={productsLoading}
                />
              </div>
            )}
            
            {/* GRID DE PRODUCTOS */}
            <div className={`mb-8 ${
              viewMode === 'grid' 
                ? 'product-grid' 
                : 'space-y-4'
            }`}>
              {productsLoading ? (
                // Skeleton loading
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))
              ) : paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    className={`animate-fade-in-up ${
                      viewMode === 'list' ? 'flex flex-row max-w-none' : ''
                    }`}
                  />
                ))
              ) : (
                // Estado vacío
                <div className="col-span-full text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2a2 2 0 00-2 2v3a2 2 0 01-2 2H8a2 2 0 01-2-2v-3a2 2 0 00-2-2H4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No se encontraron productos
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Intenta ajustar los filtros para ver más resultados
                    </p>
                    <Button onClick={() => handleFiltersChange({})}>
                      Limpiar Filtros
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            {/* PAGINACIÓN */}
            {totalPages > 1 && (
              <div className="pagination">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {/* NÚMEROS DE PÁGINA */}
                {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                  const pageNumber = Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + index;
                  if (pageNumber > totalPages) return null;
                  
                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? 'default' : 'outline'}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`pagination-btn ${currentPage === pageNumber ? 'active' : ''}`}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="px-2 text-gray-500">...</span>
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(totalPages)}
                      className="pagination-btn"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
