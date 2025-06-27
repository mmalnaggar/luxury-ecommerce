'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { 
  CubeIcon, 
  EyeIcon, 
  PlayIcon, 
  PauseIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

interface ARAsset {
  id: string
  arType: string
  fileUrl: string
  fileName: string
  description: string | null
}

interface ARViewerProps {
  productId: string
  productName: string
}

export default function ARViewer({ productId, productName }: ARViewerProps) {
  const [arAssets, setArAssets] = useState<ARAsset[]>([])
  const [selectedAsset, setSelectedAsset] = useState<ARAsset | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const fetchARAssets = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/ar/upload?productId=${productId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch AR assets')
      }
      
      const data = await response.json()
      setArAssets(data)
      
      if (data.length > 0) {
        setSelectedAsset(data[0])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load AR assets')
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    if (productId) {
      fetchARAssets()
    }
  }, [productId, fetchARAssets])

  const handleAssetSelect = (asset: ARAsset) => {
    setSelectedAsset(asset)
    setIsPlaying(false)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const resetView = () => {
    // Reset the 3D view to default position
    if (canvasRef.current) {
      // In a real implementation, you would reset the 3D camera/view
      console.log('Resetting 3D view')
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading AR content...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <EyeIcon className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading AR Content</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <button
              onClick={fetchARAssets}
              className="mt-3 text-sm text-red-800 hover:text-red-900 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (arAssets.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <CubeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No AR Content Available</h3>
        <p className="text-gray-600 mb-4">
          This product doesn&apos;t have any AR content yet.
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Request AR Content
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">AR Experience</h3>
            <p className="text-sm text-gray-600">{productName}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={togglePlay}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <PauseIcon className="h-5 w-5" />
              ) : (
                <PlayIcon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={resetView}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title="Reset View"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* 3D Viewer */}
        <div className="lg:col-span-2">
          <div className="bg-gray-100 rounded-lg aspect-square relative overflow-hidden">
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            />
            
            {/* Overlay Controls */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black bg-opacity-50 rounded-lg p-3 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {selectedAsset?.arType === 'MODEL_3D' ? '3D Model' : 'AR Experience'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded hover:bg-opacity-30 transition-colors">
                      Rotate
                    </button>
                    <button className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded hover:bg-opacity-30 transition-colors">
                      Zoom
                    </button>
                    <button className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded hover:bg-opacity-30 transition-colors">
                      Place
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* AR Instructions */}
            <div className="absolute top-4 left-4 right-4">
              <div className="bg-blue-600 text-white rounded-lg p-3">
                <p className="text-sm">
                  <strong>AR Instructions:</strong> Point your camera at a flat surface and tap to place the {productName}.
                </p>
              </div>
            </div>
          </div>

          {/* Asset Info */}
          {selectedAsset && (
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{selectedAsset.fileName}</h4>
              {selectedAsset.description && (
                <p className="text-sm text-gray-600">{selectedAsset.description}</p>
              )}
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <span className="capitalize">{selectedAsset.arType.toLowerCase().replace('_', ' ')}</span>
                <span className="mx-2">•</span>
                <span>Ready to view</span>
              </div>
            </div>
          )}
        </div>

        {/* Asset List */}
        <div className="lg:col-span-1">
          <h4 className="font-medium text-gray-900 mb-3">Available AR Content</h4>
          <div className="space-y-2">
            {arAssets.map((asset) => (
              <button
                key={asset.id}
                onClick={() => handleAssetSelect(asset)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedAsset?.id === asset.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <CubeIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {asset.fileName}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {asset.arType.toLowerCase().replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* AR Features Info */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h5 className="font-medium text-blue-900 mb-2">AR Features</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• View products in your space</li>
              <li>• Interactive 3D models</li>
              <li>• Real-time placement</li>
              <li>• Scale and rotate objects</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 