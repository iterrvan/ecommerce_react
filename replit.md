# E-commerce Platform

## Overview

This is a modern full-stack e-commerce platform built with React, Express, TypeScript, and PostgreSQL. The application provides a complete shopping experience with product catalog, shopping cart, and checkout functionality. It features a clean, responsive design using Tailwind CSS and shadcn/ui components.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: React Context API for cart state, TanStack Query for server state
- **Build Tool**: Vite for development and production builds
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Server**: Express.js with TypeScript
- **API Design**: RESTful endpoints for categories, products, cart, and orders
- **Middleware**: Express middleware for JSON parsing, CORS, and request logging
- **Error Handling**: Centralized error handling with custom error responses

### Database Architecture
- **Database**: PostgreSQL with Drizzle ORM
- **Schema**: Structured tables for categories, products, cart items, and orders
- **Migrations**: Drizzle Kit for database schema management
- **Connection**: Neon serverless PostgreSQL for cloud deployment

## Key Components

### Product Management
- Categories with hierarchical structure and product counts
- Products with images, pricing, inventory tracking, and ratings
- Support for both physical and digital products
- Featured products and sale items
- Product search and filtering capabilities

### Shopping Cart System
- Session-based cart for anonymous users
- Real-time cart updates with optimistic UI
- Cart persistence across browser sessions
- Item quantity management and removal
- Cart summary with tax and total calculations

### User Interface
- Responsive design with mobile-first approach
- Product grid and list views
- Advanced filtering and sorting options
- Shopping cart sidebar with real-time updates
- Toast notifications for user feedback
- Loading states and error handling

### Payment Processing
- Checkout form with validation using React Hook Form and Zod
- Support for multiple payment methods
- Order creation and management
- Form validation with proper error messages

## Data Flow

1. **Product Catalog**: Categories and products are fetched from the backend API and cached using TanStack Query
2. **Shopping Cart**: Cart state is managed through React Context with automatic persistence and synchronization
3. **User Actions**: Product interactions (add to cart, wishlist) trigger API calls with optimistic updates
4. **Checkout Process**: Form data is validated client-side before being sent to the backend for order creation
5. **Real-time Updates**: Cart changes are immediately reflected across all components using the cart context

## External Dependencies

### Core Dependencies
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight client-side routing
- **drizzle-orm**: Type-safe database ORM
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **react-hook-form**: Form handling with validation
- **zod**: Schema validation for forms and API data

### UI Dependencies
- **@radix-ui/react-***: Headless UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Fast build tool and development server
- **typescript**: Type safety and development experience
- **drizzle-kit**: Database schema management
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- **Local Development**: Vite development server with hot module replacement
- **Database**: PostgreSQL development instance
- **Environment Variables**: `.env` file for local configuration

### Production Deployment
- **Platform**: Replit with autoscale deployment target
- **Build Process**: Vite builds the client, esbuild bundles the server
- **Database**: Neon serverless PostgreSQL for production
- **Static Assets**: Client build served by Express in production
- **Process Management**: PM2 or similar for server process management

### Configuration
- **Environment Detection**: `NODE_ENV` based configuration switching
- **Database URL**: Environment variable for database connection
- **Port Configuration**: Dynamic port assignment for deployment platforms
- **Static File Serving**: Conditional static file serving based on environment

## Changelog
- June 16, 2025. Initial setup
- June 16, 2025. Interfaz completamente traducida al español
- June 16, 2025. Configuración de sesiones añadida para carrito funcional
- June 16, 2025. Guía completa de integración con Laravel API creada

## User Preferences

Preferred communication style: Simple, everyday language.
Interface language: Spanish (fully translated)
Backend integration: Laravel REST API (documentation provided)