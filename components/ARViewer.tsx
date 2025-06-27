'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface ARAsset {
  id: string;
  name: string;
  fileUrl: string;
  fileType: string;
  productId: string;
  createdAt: string;
}

export default function ARViewer() {
  const [arAssets, setArAssets] = useState<ARAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<ARAsset | null>(null);

  const fetchARAssets = useCallback(async () => {
    try {
      const response = await fetch('/api/ar/assets');
      if (!response.ok) {
        throw new Error('Failed to fetch AR assets');
      }
      const data = await response.json();
      setArAssets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchARAssets();
  }, [fetchARAssets]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    formData.append('productId', 'sample-product-id'); // In real app, get from context

    try {
      const response = await fetch('/api/ar/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload AR asset');
      }

      const newAsset = await response.json();
      setArAssets(prev => [...prev, newAsset]);
    } catch (err) {
      console.error('Error uploading AR asset:', err);
    }
  };

  const renderARAsset = (asset: ARAsset) => {
    switch (asset.fileType) {
      case 'glb':
      case 'gltf':
        return (
          <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">3D Model Viewer (GLB/GLTF)</p>
            <p className="text-sm text-gray-400 mt-2">Asset: {asset.name}</p>
          </div>
        );
      case 'usdz':
        return (
          <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">USDZ AR Quick Look</p>
            <p className="text-sm text-gray-400 mt-2">Asset: {asset.name}</p>
          </div>
        );
      case 'image':
        return (
          <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <Image 
              src={asset.fileUrl} 
              alt={asset.name}
              width={400}
              height={300}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        );
      default:
        return (
          <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Unsupported file type: {asset.fileType}</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading AR assets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">AR Asset Viewer</h1>
        
        {/* Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-lg font-semibold mb-4">Upload AR Asset</h2>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept=".glb,.gltf,.usdz,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-sm text-gray-500">
              Supported formats: GLB, GLTF, USDZ, Images
            </p>
          </div>
        </div>

        {/* AR Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {arAssets.map((asset) => (
            <div key={asset.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{asset.name}</h3>
                <p className="text-sm text-gray-500 mb-4">Type: {asset.fileType}</p>
                
                {renderARAsset(asset)}
                
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => setSelectedAsset(asset)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                  >
                    View in AR
                  </button>
                  <span className="text-xs text-gray-400">
                    {new Date(asset.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AR Modal */}
        {selectedAsset && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{selectedAsset.name}</h2>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                {renderARAsset(selectedAsset)}
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Use your device&apos;s AR capabilities to view this asset in your environment
                </p>
                <a
                  href={selectedAsset.fileUrl}
                  download
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                >
                  Download Asset
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 