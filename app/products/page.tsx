import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import AddToCartButton from '../components/AddToCartButton'

async function getProducts() {
  try {
    // Use Prisma directly in server component instead of fetch
    const products = await prisma.product.findMany({
      include: {
        brand: true,
        categories: true,
        reviews: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Luxury Collection</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our curated selection of premium luxury products, crafted with excellence and designed for those who appreciate the finest things in life.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Product Image */}
              <Link href={`/products/${product.id}`} className="block">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.imageUrl || '/images/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-6">
                {/* Brand */}
                <div className="flex items-center mb-3">
                  <img
                    src={product.brand.logoUrl || '/images/placeholder-brand.png'}
                    alt={product.brand.name}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <span className="text-sm text-gray-600">{product.brand.name}</span>
                </div>

                {/* Product Name */}
                <Link href={`/products/${product.id}`} className="block">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    {product.price.toLocaleString()} {product.currency}
                  </span>
                  <span className="text-sm text-gray-500">
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>

                {/* Categories */}
                {product.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.categories.slice(0, 2).map((category) => (
                      <span
                        key={category.id}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
                      >
                        {category.name}
                      </span>
                    ))}
                    {product.categories.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{product.categories.length - 2} more
                      </span>
                    )}
                  </div>
                )}

                {/* Reviews */}
                {product.reviews.length > 0 && (
                  <div className="flex items-center mb-4">
                    <div className="flex items-center space-x-1 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < Math.round(product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({product.reviews.length} reviews)
                    </span>
                  </div>
                )}

                {/* Add to Cart Button */}
                <AddToCartButton product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  currency: product.currency,
                  imageUrl: product.imageUrl || undefined,
                  stock: product.stock
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600">We're currently updating our collection. Please check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
} 