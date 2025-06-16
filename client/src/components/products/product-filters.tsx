import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, X, Filter } from 'lucide-react';
import { formatPrice } from '@/lib/api';
import type { ProductFilters, Category } from '@/types';

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  categories: Category[];
  availableBrands: string[];
  priceRange: { min: number; max: number };
  isLoading?: boolean;
  className?: string;
}

export function ProductFilters({
  filters,
  onFiltersChange,
  categories,
  availableBrands,
  priceRange,
  isLoading = false,
  className = '',
}: ProductFiltersProps) {
  
  // ESTADO LOCAL PARA COLLAPSIBLES
  const [expandedSections, setExpandedSections] = useState({
    type: true,
    price: true,
    brand: true,
    category: true,
  });

  // ESTADO LOCAL PARA EL SLIDER DE PRECIO
  const [localPriceRange, setLocalPriceRange] = useState([
    filters.priceMin || priceRange.min,
    filters.priceMax || priceRange.max,
  ]);

  // HANDLERS
  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleTypeToggle = (type: 'physical' | 'digital') => {
    const currentType = filters.type;
    const newType = currentType === type ? undefined : type;
    handleFilterChange('type', newType);
  };

  const handleBrandToggle = (brand: string) => {
    const currentBrands = filters.brands || [];
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter(b => b !== brand)
      : [...currentBrands, brand];
    
    handleFilterChange('brands', newBrands.length > 0 ? newBrands : undefined);
  };

  const handlePriceRangeChange = (values: number[]) => {
    setLocalPriceRange(values);
  };

  const handlePriceRangeCommit = (values: number[]) => {
    handleFilterChange('priceMin', values[0] > priceRange.min ? values[0] : undefined);
    handleFilterChange('priceMax', values[1] < priceRange.max ? values[1] : undefined);
  };

  const handleClearFilters = () => {
    onFiltersChange({});
    setLocalPriceRange([priceRange.min, priceRange.max]);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // CONTAR FILTROS ACTIVOS
  const activeFiltersCount = Object.values(filters).filter(v => 
    v !== undefined && v !== null && v !== '' && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  return (
    <Card className={`filters-sidebar ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Filter className="h-5 w-5 mr-2" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-sm"
            >
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        
        {/* FILTRO POR TIPO DE PRODUCTO */}
        <Collapsible 
          open={expandedSections.type} 
          onOpenChange={() => toggleSection('type')}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-0">
            <Label className="font-medium text-base">Tipo de Producto</Label>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.type ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="physical"
                checked={filters.type === 'physical'}
                onCheckedChange={() => handleTypeToggle('physical')}
                disabled={isLoading}
              />
              <Label htmlFor="physical" className="text-sm cursor-pointer">
                Productos Físicos
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="digital"
                checked={filters.type === 'digital'}
                onCheckedChange={() => handleTypeToggle('digital')}
                disabled={isLoading}
              />
              <Label htmlFor="digital" className="text-sm cursor-pointer">
                Productos Digitales
              </Label>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* FILTRO POR RANGO DE PRECIO */}
        <Collapsible 
          open={expandedSections.price} 
          onOpenChange={() => toggleSection('price')}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-0">
            <Label className="font-medium text-base">Precio</Label>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4">
            <div className="px-2">
              <Slider
                value={localPriceRange}
                onValueChange={handlePriceRangeChange}
                onValueCommit={handlePriceRangeCommit}
                max={priceRange.max}
                min={priceRange.min}
                step={5}
                className="w-full"
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{formatPrice(localPriceRange[0])}</span>
              <span>{formatPrice(localPriceRange[1])}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-gray-500">Mínimo</Label>
                <Input
                  type="number"
                  value={localPriceRange[0]}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || priceRange.min;
                    setLocalPriceRange([value, localPriceRange[1]]);
                  }}
                  onBlur={() => handlePriceRangeCommit(localPriceRange)}
                  className="h-8"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Máximo</Label>
                <Input
                  type="number"
                  value={localPriceRange[1]}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || priceRange.max;
                    setLocalPriceRange([localPriceRange[0], value]);
                  }}
                  onBlur={() => handlePriceRangeCommit(localPriceRange)}
                  className="h-8"
                  disabled={isLoading}
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* FILTRO POR CATEGORÍA */}
        {categories.length > 0 && (
          <>
            <Collapsible 
              open={expandedSections.category} 
              onOpenChange={() => toggleSection('category')}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-0">
                <Label className="font-medium text-base">Categoría</Label>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.category ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={filters.category === category.name}
                      onCheckedChange={() => 
                        handleFilterChange('category', 
                          filters.category === category.name ? undefined : category.name
                        )
                      }
                      disabled={isLoading}
                    />
                    <Label 
                      htmlFor={`category-${category.id}`} 
                      className="text-sm cursor-pointer flex-1"
                    >
                      {category.name}
                      <span className="text-gray-400 ml-1">
                        ({category.productCount})
                      </span>
                    </Label>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
            <Separator />
          </>
        )}

        {/* FILTRO POR MARCA */}
        {availableBrands.length > 0 && (
          <>
            <Collapsible 
              open={expandedSections.brand} 
              onOpenChange={() => toggleSection('brand')}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-0">
                <Label className="font-medium text-base">Marca</Label>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.brand ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                {availableBrands.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand}`}
                      checked={filters.brands?.includes(brand) || false}
                      onCheckedChange={() => handleBrandToggle(brand)}
                      disabled={isLoading}
                    />
                    <Label 
                      htmlFor={`brand-${brand}`} 
                      className="text-sm cursor-pointer"
                    >
                      {brand}
                    </Label>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
            <Separator />
          </>
        )}

        {/* FILTROS ADICIONALES */}
        <div className="space-y-3">
          <Label className="font-medium text-base">Otros Filtros</Label>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={filters.featured || false}
              onCheckedChange={(checked) => 
                handleFilterChange('featured', checked ? true : undefined)
              }
              disabled={isLoading}
            />
            <Label htmlFor="featured" className="text-sm cursor-pointer">
              Productos Destacados
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="onSale"
              checked={filters.onSale || false}
              onCheckedChange={(checked) => 
                handleFilterChange('onSale', checked ? true : undefined)
              }
              disabled={isLoading}
            />
            <Label htmlFor="onSale" className="text-sm cursor-pointer">
              En Oferta
            </Label>
          </div>
        </div>

        {/* BOTÓN APLICAR FILTROS */}
        <Button 
          className="w-full" 
          disabled={isLoading}
          onClick={() => {
            // Los filtros ya se aplican en tiempo real
            // Este botón puede ser útil en una versión móvil
          }}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
          ) : null}
          Aplicar Filtros
        </Button>
      </CardContent>
    </Card>
  );
}

// COMPONENTE COMPACTO PARA MÓVIL
export function ProductFiltersCompact({
  filters,
  onFiltersChange,
  activeFiltersCount,
}: {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  activeFiltersCount: number;
}) {
  
  const handleClearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b">
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4" />
        <span className="font-medium">Filtros</span>
        {activeFiltersCount > 0 && (
          <Badge variant="secondary">
            {activeFiltersCount}
          </Badge>
        )}
      </div>
      
      {activeFiltersCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="text-destructive"
        >
          <X className="h-4 w-4 mr-1" />
          Limpiar
        </Button>
      )}
    </div>
  );
}
