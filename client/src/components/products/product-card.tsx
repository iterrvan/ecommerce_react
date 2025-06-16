import React from 'react';
import { Link } from 'wouter';
import { Star, Heart, ShoppingCart, Download, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { 
  formatPrice, 
  formatRating, 
  getProductImageUrl, 
  isProductOnSale, 
  calculateDiscount,
  getStockStatus 
} from '@/lib/api';
import type { ProductWithCategory } from '@/types';

interface ProductCardProps {
  product: ProductWithCategory;
  className?: string;
  onWishlistToggle?: (productId: number) => void;
  isInWishlist?: boolean;
}

export function ProductCard({ 
  product, 
  className = '', 
  onWishlistToggle,
  isInWishlist = false 
}: ProductCardProps) {
  const { addToCart, isLoading } = useCart();
  const { toast } = useToast();

  // HANDLERS
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Evitar navegación del Link
    e.stopPropagation();

    try {
      await addToCart(product.id, 1);
    } catch (error) {
      // El error ya se maneja en el contexto del carrito
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    onWishlistToggle?.(product.id);
    
    toast({
      title: isInWishlist ? "Eliminado de favoritos" : "Añadido a favoritos",
      description: `${product.name} ${isInWishlist ? 'eliminado de' : 'añadido a'} tu lista de deseos`,
    });
  };

  // CÁLCULOS
  const imageUrl = getProductImageUrl(product);
  const rating = formatRating(product.rating);
  const stockStatus = getStockStatus(product);
  const onSale = isProductOnSale(product);
  const discount = onSale ? calculateDiscount(product) : 0;

  // RENDER DE ESTRELLAS
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <Card className={`product-card hover:shadow-product-hover transition-all duration-300 ${className}`}>
      <div className="relative">
        {/* IMAGEN DEL PRODUCTO */}
        <Link href={`/products/${product.slug}`}>
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
            
            {/* OVERLAY CON BADGES */}
            <div className="absolute top-3 left-3 flex flex-col space-y-2">
              {/* Badge de tipo de producto */}
              <Badge 
                className={product.type === 'physical' ? 'badge-physical' : 'badge-digital'}
              >
                {product.type === 'physical' ? (
                  <>
                    <Package className="h-3 w-3 mr-1" />
                    Físico
                  </>
                ) : (
                  <>
                    <Download className="h-3 w-3 mr-1" />
                    Digital
                  </>
                )}
              </Badge>
              
              {/* Badge de oferta */}
              {onSale && (
                <Badge className="badge-sale">
                  ¡{discount}% OFF!
                </Badge>
              )}
              
              {/* Badge de stock bajo */}
              {stockStatus === 'low-stock' && (
                <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                  Pocas unidades
                </Badge>
              )}
              
              {/* Badge sin stock */}
              {stockStatus === 'out-of-stock' && (
                <Badge variant="destructive">
                  Sin stock
                </Badge>
              )}
            </div>

            {/* BOTÓN DE FAVORITOS */}
            <div className="absolute top-3 right-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleWishlistToggle}
                className="bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 h-8 w-8"
              >
                <Heart 
                  className={`h-4 w-4 transition-colors ${
                    isInWishlist 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-gray-600 hover:text-red-500'
                  }`} 
                />
              </Button>
            </div>

            {/* INDICADOR PARA PRODUCTOS DIGITALES */}
            {product.type === 'digital' && (
              <div className="absolute bottom-3 left-3">
                <Badge variant="secondary" className="bg-black/70 text-white border-0">
                  <Download className="h-3 w-3 mr-1" />
                  Descarga Instantánea
                </Badge>
              </div>
            )}
          </div>
        </Link>

        {/* CONTENIDO DE LA CARD */}
        <CardContent className="p-6">
          {/* NOMBRE Y DESCRIPCIÓN */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
          </Link>

          {/* RATING Y RESEÑAS */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {renderStars()}
            </div>
            <span className="text-sm text-gray-500 ml-2">
              ({rating}) {product.reviewCount.toLocaleString()} reseñas
            </span>
          </div>

          {/* PRECIO Y BOTÓN */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && onSale && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              
              {/* INFORMACIÓN ADICIONAL */}
              <div className="mt-1">
                {product.type === 'physical' && stockStatus === 'in-stock' && (
                  <span className="text-xs text-secondary font-medium">
                    Envío Gratis
                  </span>
                )}
                {product.type === 'digital' && (
                  <span className="text-xs text-accent font-medium">
                    Pago único
                  </span>
                )}
              </div>
            </div>

            {/* BOTÓN DE AÑADIR AL CARRITO */}
            <Button
              onClick={handleAddToCart}
              disabled={stockStatus === 'out-of-stock' || isLoading}
              className={`transition-all duration-200 ${
                product.type === 'digital' 
                  ? 'bg-accent hover:bg-accent/90' 
                  : 'bg-primary hover:bg-primary/90'
              }`}
              size="sm"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <>
                  {product.type === 'digital' ? (
                    <Download className="h-4 w-4 mr-1" />
                  ) : (
                    <ShoppingCart className="h-4 w-4 mr-1" />
                  )}
                  {stockStatus === 'out-of-stock' 
                    ? 'Sin Stock' 
                    : product.type === 'digital' 
                      ? 'Comprar' 
                      : 'Añadir'
                  }
                </>
              )}
            </Button>
          </div>

          {/* CARACTERÍSTICAS ADICIONALES */}
          {product.tags && product.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-xs"
                >
                  {tag}
                </Badge>
              ))}
              {product.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}

// COMPONENTE DE SKELETON PARA CARGA
export function ProductCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <Card className={`${className}`}>
      <div className="animate-pulse">
        {/* Imagen skeleton */}
        <div className="h-48 bg-gray-200 rounded-t-lg"></div>
        
        <CardContent className="p-6">
          {/* Título skeleton */}
          <div className="h-6 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          
          {/* Rating skeleton */}
          <div className="flex items-center mb-3">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 w-4 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-4 bg-gray-200 rounded w-20 ml-2"></div>
          </div>
          
          {/* Precio y botón skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-24"></div>
            <div className="h-9 bg-gray-200 rounded w-20"></div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
