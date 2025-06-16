import React, { useState } from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Star, Heart, ShoppingCart, Download, Package, Truck, Shield, ArrowLeft, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { EcommerceAPI, formatPrice, formatRating, getProductImageUrl, isProductOnSale, calculateDiscount, getStockStatus } from '@/lib/api';
import { Link } from 'wouter';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart, isLoading: cartLoading } = useCart();
  const { toast } = useToast();
  
  // ESTADO LOCAL
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  // CONSULTA DEL PRODUCTO
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['/api/products/slug', slug],
    queryFn: () => EcommerceAPI.getProductBySlug(slug!),
    enabled: !!slug,
  });

  // PRODUCTOS RELACIONADOS
  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['/api/products', 'related', product?.categoryId],
    queryFn: () => EcommerceAPI.getProducts({ 
      category: product?.category,
    }),
    enabled: !!product,
  });

  // HANDLERS
  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart(product.id, quantity);
    } catch (error) {
      // Error ya manejado en el contexto
    }
  };

  const handleWishlistToggle = () => {
    setIsInWishlist(!isInWishlist);
    toast({
      title: isInWishlist ? "Eliminado de favoritos" : "Añadido a favoritos",
      description: `${product?.name} ${isInWishlist ? 'eliminado de' : 'añadido a'} tu lista de deseos`,
    });
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  // ERROR STATE
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
          <p className="text-gray-600 mb-6">Lo sentimos, no pudimos encontrar el producto que buscas.</p>
          <Link href="/products">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Productos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // CÁLCULOS
  const rating = formatRating(product.rating);
  const stockStatus = getStockStatus(product);
  const onSale = isProductOnSale(product);
  const discount = onSale ? calculateDiscount(product) : 0;
  const filteredRelatedProducts = relatedProducts.filter(p => p.id !== product.id).slice(0, 4);

  // RENDER DE ESTRELLAS
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="h-5 w-5 fill-yellow-400/50 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="h-5 w-5 text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* BREADCRUMB */}
        <nav className="breadcrumb mb-6">
          <Link href="/" className="hover:text-primary">Inicio</Link>
          <span className="breadcrumb-separator">/</span>
          <Link href="/products" className="hover:text-primary">Productos</Link>
          <span className="breadcrumb-separator">/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-primary">
            {product.category}
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="font-medium">{product.name}</span>
        </nav>
        
        {/* CONTENIDO PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* GALERÍA DE IMÁGENES */}
          <div className="space-y-4">
            {/* IMAGEN PRINCIPAL */}
            <div className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-sm">
              <img
                src={getProductImageUrl(product, selectedImageIndex)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* BADGES */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                <Badge className={product.type === 'physical' ? 'badge-physical' : 'badge-digital'}>
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
                
                {onSale && (
                  <Badge className="badge-sale">
                    ¡{discount}% OFF!
                  </Badge>
                )}
              </div>
              
              {/* BOTÓN FAVORITOS */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleWishlistToggle}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white h-10 w-10"
              >
                <Heart 
                  className={`h-5 w-5 transition-colors ${
                    isInWishlist 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-gray-600 hover:text-red-500'
                  }`} 
                />
              </Button>
            </div>
            
            {/* MINIATURAS */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index 
                        ? 'border-primary' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* INFORMACIÓN DEL PRODUCTO */}
          <div className="space-y-6">
            
            {/* TÍTULO Y RATING */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {renderStars()}
                </div>
                <span className="text-gray-600">
                  ({rating}) {product.reviewCount.toLocaleString()} reseñas
                </span>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>
            </div>
            
            {/* PRECIO */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && onSale && (
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {onSale && (
                <Badge className="badge-sale text-lg px-3 py-1">
                  Ahorra {formatPrice(parseFloat(product.originalPrice!) - parseFloat(product.price))}
                </Badge>
              )}
            </div>
            
            {/* ESTADO DEL STOCK */}
            <div className="flex items-center space-x-2">
              {stockStatus === 'in-stock' && (
                <Badge variant="outline" className="text-secondary border-secondary">
                  ✓ En Stock
                </Badge>
              )}
              {stockStatus === 'low-stock' && (
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  ⚠ Pocas Unidades
                </Badge>
              )}
              {stockStatus === 'out-of-stock' && (
                <Badge variant="destructive">
                  ✗ Sin Stock
                </Badge>
              )}
              
              {product.type === 'digital' && (
                <Badge variant="outline" className="text-accent border-accent">
                  <Download className="h-3 w-3 mr-1" />
                  Descarga Instantánea
                </Badge>
              )}
            </div>
            
            {/* CONTROLES DE CANTIDAD (solo para productos físicos) */}
            {product.type === 'physical' && stockStatus !== 'out-of-stock' && (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Cantidad:</span>
                <div className="quantity-counter">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="quantity-btn"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="quantity-display">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={product.stockQuantity !== null && quantity >= product.stockQuantity}
                    className="quantity-btn"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {product.stockQuantity !== null && (
                  <span className="text-sm text-gray-600">
                    {product.stockQuantity} disponibles
                  </span>
                )}
              </div>
            )}
            
            {/* BOTONES DE ACCIÓN */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={stockStatus === 'out-of-stock' || cartLoading}
                className={`flex-1 ${
                  product.type === 'digital' 
                    ? 'bg-accent hover:bg-accent/90' 
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                {cartLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                ) : (
                  <>
                    {product.type === 'digital' ? (
                      <Download className="h-5 w-5 mr-2" />
                    ) : (
                      <ShoppingCart className="h-5 w-5 mr-2" />
                    )}
                  </>
                )}
                {stockStatus === 'out-of-stock' 
                  ? 'Sin Stock' 
                  : product.type === 'digital' 
                    ? 'Comprar Ahora' 
                    : 'Añadir al Carrito'
                }
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleWishlistToggle}
                className="sm:flex-none"
              >
                <Heart className={`h-5 w-5 mr-2 ${isInWishlist ? 'fill-current' : ''}`} />
                {isInWishlist ? 'En Favoritos' : 'Añadir a Favoritos'}
              </Button>
            </div>
            
            {/* INFORMACIÓN ADICIONAL */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-secondary" />
                <div>
                  <p className="font-medium text-sm">Envío Gratis</p>
                  <p className="text-xs text-gray-600">Pedidos +€50</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Garantía</p>
                  <p className="text-xs text-gray-600">30 días</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-accent" />
                <div>
                  <p className="font-medium text-sm">Calidad</p>
                  <p className="text-xs text-gray-600">Garantizada</p>
                </div>
              </div>
            </div>
            
            {/* TAGS */}
            {product.tags && product.tags.length > 0 && (
              <div className="pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Etiquetas:</p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* PRODUCTOS RELACIONADOS */}
        {filteredRelatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Productos Relacionados</h2>
            <div className="product-grid">
              {filteredRelatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="animate-fade-in-up">
                  <Link href={`/products/${relatedProduct.slug}`}>
                    <Card className="product-card hover:shadow-product-hover">
                      <div className="aspect-square bg-white rounded-t-lg overflow-hidden">
                        <img
                          src={getProductImageUrl(relatedProduct)}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                          {relatedProduct.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-gray-900">
                            {formatPrice(relatedProduct.price)}
                          </span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="text-sm text-gray-600">
                              {formatRating(relatedProduct.rating)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
