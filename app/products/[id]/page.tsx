import React, { useState, useEffect } from 'react';
import { Product } from '@prisma/client';
import Image from 'next/image';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: PageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { id } = await params;
        const response = await fetch(`/api/catalog/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data: Product = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error || 'Product not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <div className="h-48 w-full object-cover md:w-48">
                <Image
                  src={product.imageUrl || '/placeholder-product.jpg'}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                {product.brand?.name || 'Unknown Brand'}
              </div>
              <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
                {product.name}
              </h1>
              <p className="mt-2 text-slate-500">{product.description}</p>
              <div className="mt-4">
                <span className="text-2xl font-bold text-green-600">${product.price}</span>
              </div>
              <div className="mt-6">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 