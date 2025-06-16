# 🔌 Guía de Integración con API REST Laravel

## 📋 Resumen
Esta guía te explica paso a paso cómo conectar tu frontend React con una API REST Laravel para crear un e-commerce completo.

## 🚀 Configuración Inicial

### 1. Configuración del Backend Laravel

#### Estructura de Modelos Laravel
Crea los siguientes modelos en Laravel:

```php
// app/Models/Category.php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'name', 'slug', 'description', 'icon', 'product_count'
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}

// app/Models/Product.php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name', 'slug', 'description', 'price', 'original_price',
        'brand', 'images', 'category_id', 'type', 'in_stock',
        'stock_quantity', 'is_featured', 'is_on_sale', 'rating',
        'review_count', 'tags', 'download_url'
    ];

    protected $casts = [
        'images' => 'array',
        'tags' => 'array',
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'rating' => 'decimal:1',
        'in_stock' => 'boolean',
        'is_featured' => 'boolean',
        'is_on_sale' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }
}

// app/Models/CartItem.php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $fillable = [
        'session_id', 'product_id', 'quantity'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}

// app/Models/Order.php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'session_id', 'email', 'first_name', 'last_name',
        'address', 'city', 'postal_code', 'country',
        'phone', 'subtotal', 'tax', 'total', 'status'
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax' => 'decimal:2',
        'total' => 'decimal:2',
    ];
}
```

#### Migraciones Laravel

```php
// database/migrations/create_categories_table.php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoriesTable extends Migration
{
    public function up()
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->integer('product_count')->default(0);
            $table->timestamps();
        });
    }
}

// database/migrations/create_products_table.php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->string('brand')->nullable();
            $table->json('images');
            $table->string('category');
            $table->foreignId('category_id')->nullable()->constrained();
            $table->enum('type', ['physical', 'digital']);
            $table->boolean('in_stock')->default(true);
            $table->integer('stock_quantity')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_on_sale')->default(false);
            $table->decimal('rating', 2, 1)->default(0);
            $table->integer('review_count')->default(0);
            $table->json('tags')->nullable();
            $table->string('download_url')->nullable();
            $table->timestamps();
        });
    }
}

// database/migrations/create_cart_items_table.php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCartItemsTable extends Migration
{
    public function up()
    {
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->string('session_id');
            $table->foreignId('product_id')->constrained();
            $table->integer('quantity')->default(1);
            $table->timestamps();
        });
    }
}

// database/migrations/create_orders_table.php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('session_id');
            $table->string('email');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('address');
            $table->string('city');
            $table->string('postal_code');
            $table->string('country');
            $table->string('phone')->nullable();
            $table->decimal('subtotal', 10, 2);
            $table->decimal('tax', 10, 2);
            $table->decimal('total', 10, 2);
            $table->enum('status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])->default('pending');
            $table->timestamps();
        });
    }
}
```

### 2. Controladores Laravel

#### CategoryController.php
```php
<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with('products')->get();
        
        // Actualizar conteo de productos
        $categories->each(function ($category) {
            $category->product_count = $category->products->count();
            $category->save();
        });

        return response()->json($categories);
    }

    public function show($slug)
    {
        $category = Category::where('slug', $slug)->first();
        
        if (!$category) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }

        return response()->json($category);
    }
}
```

#### ProductController.php
```php
<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category');

        // Filtros
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('tags', 'like', "%{$search}%");
            });
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        if ($request->boolean('onSale')) {
            $query->where('is_on_sale', true);
        }

        if ($request->has('priceMin')) {
            $query->where('price', '>=', $request->priceMin);
        }

        if ($request->has('priceMax')) {
            $query->where('price', '<=', $request->priceMax);
        }

        if ($request->has('brands')) {
            $brands = explode(',', $request->brands);
            $query->whereIn('brand', $brands);
        }

        // Ordenamiento
        switch ($request->get('sortBy', 'newest')) {
            case 'price-asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price-desc':
                $query->orderBy('price', 'desc');
                break;
            case 'popular':
                $query->orderBy('review_count', 'desc');
                break;
            case 'rating':
                $query->orderBy('rating', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        $products = $query->get();

        // Agregar datos de categoría
        $products->each(function ($product) {
            $product->categoryData = $product->category;
        });

        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::with('category')->find($id);
        
        if (!$product) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        $product->categoryData = $product->category;
        return response()->json($product);
    }

    public function showBySlug($slug)
    {
        $product = Product::with('category')->where('slug', $slug)->first();
        
        if (!$product) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        $product->categoryData = $product->category;
        return response()->json($product);
    }
}
```

#### CartController.php
```php
<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    private function getSessionId(Request $request)
    {
        if (!$request->session()->has('cart_id')) {
            $request->session()->put('cart_id', 'cart_' . time() . '_' . uniqid());
        }
        return $request->session()->get('cart_id');
    }

    public function index(Request $request)
    {
        $sessionId = $this->getSessionId($request);
        $summary = $this->getCartSummary($sessionId);
        return response()->json($summary);
    }

    public function store(Request $request)
    {
        $request->validate([
            'productId' => 'required|integer|exists:products,id',
            'quantity' => 'integer|min:1'
        ]);

        $sessionId = $this->getSessionId($request);
        $productId = $request->productId;
        $quantity = $request->get('quantity', 1);

        // Verificar producto
        $product = Product::find($productId);
        if (!$product) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        // Verificar stock
        if ($product->type === 'physical' && $product->stock_quantity !== null) {
            if ($product->stock_quantity < $quantity) {
                return response()->json([
                    'message' => 'Stock insuficiente',
                    'available' => $product->stock_quantity
                ], 400);
            }
        }

        // Buscar item existente
        $existingItem = CartItem::where('session_id', $sessionId)
                               ->where('product_id', $productId)
                               ->first();

        if ($existingItem) {
            $existingItem->quantity += $quantity;
            $existingItem->save();
        } else {
            CartItem::create([
                'session_id' => $sessionId,
                'product_id' => $productId,
                'quantity' => $quantity
            ]);
        }

        $summary = $this->getCartSummary($sessionId);
        
        return response()->json([
            'message' => 'Producto agregado al carrito',
            'data' => ['summary' => $summary]
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $sessionId = $this->getSessionId($request);
        $item = CartItem::where('id', $id)
                       ->where('session_id', $sessionId)
                       ->first();

        if (!$item) {
            return response()->json(['message' => 'Item no encontrado'], 404);
        }

        $item->quantity = $request->quantity;
        $item->save();

        $summary = $this->getCartSummary($sessionId);
        
        return response()->json([
            'message' => 'Cantidad actualizada',
            'data' => ['summary' => $summary]
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $sessionId = $this->getSessionId($request);
        $item = CartItem::where('id', $id)
                       ->where('session_id', $sessionId)
                       ->first();

        if (!$item) {
            return response()->json(['message' => 'Item no encontrado'], 404);
        }

        $item->delete();

        $summary = $this->getCartSummary($sessionId);
        
        return response()->json([
            'message' => 'Producto eliminado del carrito',
            'data' => ['summary' => $summary]
        ]);
    }

    public function clear(Request $request)
    {
        $sessionId = $this->getSessionId($request);
        CartItem::where('session_id', $sessionId)->delete();

        return response()->json(['message' => 'Carrito vaciado']);
    }

    private function getCartSummary($sessionId)
    {
        $items = CartItem::with('product')
                         ->where('session_id', $sessionId)
                         ->get();

        $subtotal = $items->sum(function ($item) {
            return floatval($item->product->price) * $item->quantity;
        });

        $tax = $subtotal * 0.21; // 21% IVA
        $total = $subtotal + $tax;
        $itemCount = $items->sum('quantity');

        return [
            'items' => $items,
            'subtotal' => round($subtotal, 2),
            'tax' => round($tax, 2),
            'total' => round($total, 2),
            'itemCount' => $itemCount,
        ];
    }
}
```

#### OrderController.php
```php
<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\CartItem;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'firstName' => 'required|string',
            'lastName' => 'required|string',
            'address' => 'required|string',
            'city' => 'required|string',
            'postalCode' => 'required|string',
            'country' => 'required|string',
            'phone' => 'nullable|string',
        ]);

        $sessionId = $request->session()->get('cart_id');
        if (!$sessionId) {
            return response()->json(['message' => 'Carrito vacío'], 400);
        }

        // Calcular totales
        $cartController = new CartController();
        $summary = $cartController->getCartSummary($sessionId);

        if ($summary['itemCount'] === 0) {
            return response()->json(['message' => 'Carrito vacío'], 400);
        }

        // Crear orden
        $order = Order::create([
            'session_id' => $sessionId,
            'email' => $validated['email'],
            'first_name' => $validated['firstName'],
            'last_name' => $validated['lastName'],
            'address' => $validated['address'],
            'city' => $validated['city'],
            'postal_code' => $validated['postalCode'],
            'country' => $validated['country'],
            'phone' => $validated['phone'],
            'subtotal' => $summary['subtotal'],
            'tax' => $summary['tax'],
            'total' => $summary['total'],
            'status' => 'pending'
        ]);

        // Limpiar carrito
        CartItem::where('session_id', $sessionId)->delete();

        return response()->json([
            'message' => 'Pedido creado exitosamente',
            'data' => ['order' => $order]
        ]);
    }

    public function show($id)
    {
        $order = Order::find($id);
        
        if (!$order) {
            return response()->json(['message' => 'Pedido no encontrado'], 404);
        }

        return response()->json($order);
    }
}
```

### 3. Rutas Laravel (routes/api.php)

```php
<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;

// Categorías
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);

// Productos
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/products/slug/{slug}', [ProductController::class, 'showBySlug']);

// Carrito
Route::get('/cart', [CartController::class, 'index']);
Route::post('/cart', [CartController::class, 'store']);
Route::put('/cart/{id}', [CartController::class, 'update']);
Route::delete('/cart/{id}', [CartController::class, 'destroy']);
Route::delete('/cart', [CartController::class, 'clear']);

// Pedidos
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/{id}', [OrderController::class, 'show']);
```

### 4. Configuración CORS Laravel

```php
// config/cors.php
<?php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:5000', 'http://localhost:3000'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

## 🔧 Configuración del Frontend React

### 1. Modificar archivo de configuración API

Actualiza `client/src/lib/api.ts` para conectar con Laravel:

```typescript
// client/src/lib/api.ts
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export class EcommerceAPI {
  // Configuración base
  private static async fetchAPI(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Para sesiones
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    return response.json();
  }

  // Resto de métodos igual...
  static async getCategories(): Promise<Category[]> {
    return this.fetchAPI('/categories');
  }

  static async getProducts(filters: ProductFilters = {}): Promise<ProductWithCategory[]> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          params.append(key, value.join(','));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const endpoint = params.toString() ? `/products?${params}` : '/products';
    return this.fetchAPI(endpoint);
  }

  // ... resto de métodos
}
```

### 2. Variables de Entorno

Crea `.env` en la raíz del proyecto React:

```env
# .env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_APP_NAME=ModernShop
REACT_APP_VERSION=1.0.0
```

### 3. Configuración de Desarrollo

Para desarrollo local, asegúrate de que:

1. **Laravel** corra en `http://localhost:8000`
2. **React** corra en `http://localhost:5000`
3. **CORS** esté configurado correctamente

## 🧪 Pruebas y Verificación

### 1. Seeders Laravel para Datos de Prueba

```php
// database/seeders/DatabaseSeeder.php
<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Crear categorías
        $categories = [
            [
                'name' => 'Electrónicos',
                'slug' => 'electronicos',
                'description' => 'Dispositivos y gadgets tecnológicos',
                'icon' => 'fas fa-laptop'
            ],
            [
                'name' => 'Moda',
                'slug' => 'moda',
                'description' => 'Ropa y accesorios de moda',
                'icon' => 'fas fa-tshirt'
            ],
            // ... más categorías
        ];

        foreach ($categories as $categoryData) {
            Category::create($categoryData);
        }

        // Crear productos
        $products = [
            [
                'name' => 'MacBook Pro 14"',
                'slug' => 'macbook-pro-14',
                'description' => 'Potente laptop para profesionales',
                'price' => 2399.99,
                'original_price' => 2599.99,
                'brand' => 'Apple',
                'images' => ['/images/macbook-pro.jpg'],
                'category' => 'Electrónicos',
                'category_id' => 1,
                'type' => 'physical',
                'in_stock' => true,
                'stock_quantity' => 25,
                'is_featured' => true,
                'is_on_sale' => true,
                'rating' => 4.8,
                'review_count' => 124,
                'tags' => ['laptop', 'apple', 'profesional']
            ],
            // ... más productos
        ];

        foreach ($products as $productData) {
            Product::create($productData);
        }
    }
}
```

### 2. Comandos de Instalación

```bash
# Laravel
php artisan migrate
php artisan db:seed
php artisan serve

# React
npm install
npm run dev
```

## 🎯 Puntos Clave de Integración

### 1. Autenticación (Opcional)
Si necesitas autenticación de usuarios:

```php
// Laravel Sanctum para API tokens
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 2. Gestión de Archivos
Para subida de imágenes:

```php
// En ProductController
public function uploadImage(Request $request)
{
    $request->validate([
        'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    $path = $request->file('image')->store('products', 'public');
    
    return response()->json([
        'url' => Storage::url($path)
    ]);
}
```

### 3. Validaciones y Errores
Laravel maneja las validaciones automáticamente y devuelve errores en formato JSON que el frontend puede procesar.

### 4. Paginación
Para listas grandes de productos:

```php
// En ProductController
$products = $query->paginate(12);
return response()->json($products);
```

## 📱 Despliegue en Producción

### 1. Variables de Entorno Producción

```env
# Laravel .env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-dominio.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tu_base_datos
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
```

```env
# React .env.production
REACT_APP_API_URL=https://tu-dominio.com/api
```

### 2. Optimizaciones

```bash
# Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# React
npm run build
```

## ✅ Lista de Verificación

- [ ] Modelos Laravel creados
- [ ] Migraciones ejecutadas
- [ ] Controladores implementados
- [ ] Rutas API configuradas
- [ ] CORS habilitado
- [ ] Frontend configurado para conectar con Laravel
- [ ] Variables de entorno configuradas
- [ ] Datos de prueba creados
- [ ] Funcionalidad del carrito probada
- [ ] Proceso de checkout verificado

## 🆘 Problemas Comunes

### Error CORS
```php
// Verificar config/cors.php
'supports_credentials' => true,
'allowed_origins' => ['http://localhost:5000'],
```

### Error de Sesiones
```php
// Verificar config/session.php
'same_site' => 'lax',
'secure' => false, // true en producción con HTTPS
```

### Error de Base de Datos
```bash
php artisan migrate:fresh --seed
```

---

**¡Tu e-commerce con React + Laravel está listo para funcionar!** 🚀

Esta guía te proporciona todo lo necesario para integrar tu frontend React con un backend Laravel robusto y escalable.