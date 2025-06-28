"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ARAssetsPageProps {
  params: { id: string };
}

export default function ARAssetsPage({ params }: ARAssetsPageProps) {
  const [productId, setProductId] = useState<string>(params.id);
  const [arAssets, setArAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (productId) {
      fetchARAssets();
    }
  }, [productId]);

  const fetchARAssets = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/ar-assets`);
      if (response.ok) {
        const assets = await response.json();
        setArAssets(assets);
      }
    } catch (error) {
      console.error("Error fetching AR assets:", error);
      toast.error("Failed to load AR assets");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/products/${productId}/ar-assets`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("AR asset uploaded successfully");
        fetchARAssets();
      } else {
        const error = await response.json();
        toast.error(error.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (assetId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}/ar-assets?assetId=${assetId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("AR asset deleted successfully");
        fetchARAssets();
      } else {
        const error = await response.json();
        toast.error(error.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AR Assets</h1>
          <p className="mt-2 text-gray-600">Manage AR assets for your product</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white shadow sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upload AR Asset</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  AR Asset File (GLB, GLTF, USDZ)
                </label>
                <input
                  type="file"
                  accept=".glb,.gltf,.usdz"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              {uploading && (
                <div className="text-sm text-gray-500">Uploading...</div>
              )}
            </div>
          </div>
        </div>

        {/* Assets List */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">AR Assets</h3>
            {arAssets.length === 0 ? (
              <p className="text-gray-500">No AR assets uploaded yet.</p>
            ) : (
              <div className="space-y-4">
                {arAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{asset.type}</p>
                      <p className="text-sm text-gray-500">{asset.url}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(asset.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 