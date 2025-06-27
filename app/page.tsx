import React from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Welcome to Egyptian E-commerce Platform
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Modern e-commerce platform for Egyptian fashion brands with AR try-on capabilities
          </p>
        </div>

        {/* Status */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Platform Status
          </h3>
          <div className="space-y-2">
            <p className="text-green-600">✅ Next.js application is running</p>
            <p className="text-green-600">✅ Vercel deployment successful</p>
            <p className="text-yellow-600">⚠️ Database features temporarily disabled</p>
            <p className="text-sm text-gray-600">
              Authentication and product features will be available once database is connected
            </p>
          </div>
        </div>

        {/* Feature Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Browse Products
            </h4>
            <p className="text-gray-600 text-sm mb-4">
              Explore our collection of Egyptian fashion brands
            </p>
            <Link
              href="/products"
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              View Products →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Simple Test Page
            </h4>
            <p className="text-gray-600 text-sm mb-4">
              Test basic Next.js routing functionality
            </p>
            <Link
              href="/simple"
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              View Simple Page →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Minimal Test Page
            </h4>
            <p className="text-gray-600 text-sm mb-4">
              Test minimal React component
            </p>
            <Link
              href="/minimal"
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              View Minimal Page →
            </Link>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">
            Next Steps
          </h3>
          <div className="space-y-2 text-sm">
            <p>1. ✅ <strong>Deploy Next.js app</strong> - Completed!</p>
            <p>2. 🔄 <strong>Set up database</strong> - In progress</p>
            <p>3. 🔄 <strong>Enable authentication</strong> - Pending database</p>
            <p>4. 🔄 <strong>Add product catalog</strong> - Pending database</p>
            <p>5. 🔄 <strong>Configure payments</strong> - Pending authentication</p>
          </div>
        </div>
      </main>
    </div>
  )
}
