import React from 'react';
import { Link } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Send
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  // ENLACES ORGANIZADOS POR SECCIONES
  const footerSections = {
    tienda: [
      { label: 'Productos Físicos', href: '/products?type=physical' },
      { label: 'Productos Digitales', href: '/products?type=digital' },
      { label: 'Ofertas', href: '/offers' },
      { label: 'Nuevos Productos', href: '/products?featured=true' },
    ],
    soporte: [
      { label: 'Centro de Ayuda', href: '/help' },
      { label: 'Envíos y Devoluciones', href: '/shipping' },
      { label: 'Contacto', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
    ],
    empresa: [
      { label: 'Sobre Nosotros', href: '/about' },
      { label: 'Términos de Servicio', href: '/terms' },
      { label: 'Política de Privacidad', href: '/privacy' },
      { label: 'Política de Cookies', href: '/cookies' },
    ],
  };

  // ENLACES SOCIALES
  const socialLinks = [
    { 
      icon: Facebook, 
      href: '#', 
      label: 'Facebook',
      className: 'hover:text-blue-600'
    },
    { 
      icon: Twitter, 
      href: '#', 
      label: 'Twitter',
      className: 'hover:text-blue-400'
    },
    { 
      icon: Instagram, 
      href: '#', 
      label: 'Instagram',
      className: 'hover:text-pink-500'
    },
    { 
      icon: Linkedin, 
      href: '#', 
      label: 'LinkedIn',
      className: 'hover:text-blue-700'
    },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    
    // TODO: Implementar lógica de suscripción al newsletter
    console.log('Suscripción al newsletter:', email);
    
    // Reset form
    e.currentTarget.reset();
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* CONTENIDO PRINCIPAL DEL FOOTER */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* SECCIÓN DE LA EMPRESA */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <h3 className="text-2xl font-bold text-primary">ModernShop</h3>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Tu tienda online de confianza para productos físicos y digitales de alta calidad. 
              Ofrecemos la mejor experiencia de compra con envío rápido y soporte excepcional.
            </p>
            
            {/* REDES SOCIALES */}
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href, label, className }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`text-gray-400 transition-colors duration-200 ${className}`}
                >
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
          
          {/* SECCIÓN TIENDA */}
          <div>
            <h4 className="font-bold text-lg mb-4">Tienda</h4>
            <ul className="space-y-3">
              {footerSections.tienda.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* SECCIÓN SOPORTE */}
          <div>
            <h4 className="font-bold text-lg mb-4">Soporte</h4>
            <ul className="space-y-3">
              {footerSections.soporte.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* SECCIÓN NEWSLETTER */}
          <div>
            <h4 className="font-bold text-lg mb-4">Newsletter</h4>
            <p className="text-gray-300 mb-4">
              Recibe las últimas ofertas y novedades directamente en tu email
            </p>
            
            {/* FORMULARIO DE NEWSLETTER */}
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  name="email"
                  placeholder="tu@email.com"
                  required
                  className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-primary focus:ring-primary"
                />
                <Button 
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-4"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Suscribirse</span>
                </Button>
              </div>
            </form>
            
            {/* INFORMACIÓN ADICIONAL */}
            <p className="text-xs text-gray-400 mt-3">
              Al suscribirte, aceptas recibir emails promocionales. 
              Puedes darte de baja en cualquier momento.
            </p>
          </div>
        </div>
        
        <Separator className="bg-gray-800 mb-8" />
        
        {/* SECCIÓN INFERIOR */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          
          {/* COPYRIGHT */}
          <div className="text-gray-400 text-sm">
            <p>&copy; {currentYear} ModernShop. Todos los derechos reservados.</p>
          </div>
          
          {/* ENLACES LEGALES */}
          <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
            {footerSections.empresa.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        
        {/* INFORMACIÓN ADICIONAL */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-400">
            
            {/* MÉTODOS DE PAGO */}
            <div>
              <h5 className="font-medium text-white mb-2">Métodos de Pago</h5>
              <p>Visa, Mastercard, PayPal, Transferencia bancaria</p>
            </div>
            
            {/* ENVÍOS */}
            <div>
              <h5 className="font-medium text-white mb-2">Envíos</h5>
              <p>Envío gratis en pedidos superiores a €50. Entrega en 24-48h</p>
            </div>
            
            {/* GARANTÍA */}
            <div>
              <h5 className="font-medium text-white mb-2">Garantía</h5>
              <p>30 días de garantía de devolución. Productos originales</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
