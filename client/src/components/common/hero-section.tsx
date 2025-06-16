import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowRight, Star, Zap, Package, Download } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="hero-gradient text-white py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* CONTENIDO PRINCIPAL */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Descubre Productos{' '}
              <span className="text-blue-100">Increíbles</span>
            </h1>
            
            <p className="text-xl mb-8 text-blue-100 leading-relaxed max-w-2xl">
              Productos físicos y digitales de la más alta calidad. 
              Envío gratis en pedidos superiores a €50 y soporte excepcional.
            </p>
            
            {/* BOTONES DE ACCIÓN */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/products">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                >
                  Explorar Productos
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              
              <Link href="/offers">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-300"
                >
                  Ver Ofertas
                  <Star className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
            
            {/* ESTADÍSTICAS */}
            <div className="grid grid-cols-3 gap-6 text-center lg:text-left">
              <div>
                <div className="text-3xl font-bold mb-1">500+</div>
                <div className="text-blue-200 text-sm">Productos</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">10k+</div>
                <div className="text-blue-200 text-sm">Clientes</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">4.9</div>
                <div className="text-blue-200 text-sm">Valoración</div>
              </div>
            </div>
          </div>
          
          {/* GRID DE CATEGORÍAS DESTACADAS */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-6 text-center">
                Categorías Populares
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* TECNOLOGÍA */}
                <Link href="/products?category=Electrónicos">
                  <div className="bg-white/20 rounded-xl p-6 text-center hover:bg-white/30 transition-all duration-300 cursor-pointer group">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Zap className="h-6 w-6" />
                    </div>
                    <h4 className="font-medium mb-1">Tecnología</h4>
                    <p className="text-sm text-blue-200">245 productos</p>
                  </div>
                </Link>
                
                {/* MODA */}
                <Link href="/products?category=Moda">
                  <div className="bg-white/20 rounded-xl p-6 text-center hover:bg-white/30 transition-all duration-300 cursor-pointer group">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Package className="h-6 w-6" />
                    </div>
                    <h4 className="font-medium mb-1">Moda</h4>
                    <p className="text-sm text-blue-200">189 productos</p>
                  </div>
                </Link>
                
                {/* DIGITALES */}
                <Link href="/products?type=digital">
                  <div className="bg-white/20 rounded-xl p-6 text-center hover:bg-white/30 transition-all duration-300 cursor-pointer group">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Download className="h-6 w-6" />
                    </div>
                    <h4 className="font-medium mb-1">Digitales</h4>
                    <p className="text-sm text-blue-200">87 productos</p>
                  </div>
                </Link>
                
                {/* HOGAR */}
                <Link href="/products?category=Hogar">
                  <div className="bg-white/20 rounded-xl p-6 text-center hover:bg-white/30 transition-all duration-300 cursor-pointer group">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 4h4" />
                      </svg>
                    </div>
                    <h4 className="font-medium mb-1">Hogar</h4>
                    <p className="text-sm text-blue-200">156 productos</p>
                  </div>
                </Link>
              </div>
            </div>
            
            {/* DECORACIÓN FLOTANTE */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
      
      {/* WAVE DIVIDER */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-16"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".25" 
            className="fill-gray-50"
          />
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity=".5" 
            className="fill-gray-50"
          />
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            className="fill-gray-50"
          />
        </svg>
      </div>
    </section>
  );
}
