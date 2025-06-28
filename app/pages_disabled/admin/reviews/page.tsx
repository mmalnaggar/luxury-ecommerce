'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { Star, Flag, User, ChevronLeft, ChevronRight } from 'lucide-react'

interface ReviewUser {
  id: string
  name: string | null
  email: string | null
}

interface ReviewProduct {
  id: string
  name: string
  brand: {
    id: string
    name: string
  }
}

interface ReviewReport {
  id: string
  reason: string
  details: string | null
  createdAt: string
  user: {
    id: string
    name: string | null
  }
}

interface Review {
  id: string
  rating: number
  comment: string | null
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED'
  createdAt: string
  user: ReviewUser
  product: ReviewProduct
  reports: ReviewReport[]
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedStatus, setSelectedStatus] = useState('PENDING')
  const [moderatingId, setModeratingId] = useState<string | null>(null)

  useEffect(() => {
    fetchReviews(currentPage, selectedStatus)
  }, [currentPage, selectedStatus])

  const fetchReviews = async (page = 1, status = selectedStatus) => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/reviews/moderate?status=${status}&page=${page}&limit=10`
      )
      const data = await response.json()

      if (response.ok) {
        setReviews(data.reviews)
        setCurrentPage(data.currentPage)
        setTotalPages(data.totalPages)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleModeration = async (reviewId: string, newStatus: string) => {
    setModeratingId(reviewId)

    try {
      const response = await fetch('/api/reviews/moderate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId,
          status: newStatus,
        }),
      })

      if (response.ok) {
        // Remove the review from the current list
        setReviews(reviews.filter(review => review.id !== reviewId))
      } else {
        const data = await response.json()
        alert(data.error || `Failed to ${newStatus.toLowerCase()} review`)
      }
    } catch (error) {
      alert(`Failed to ${newStatus.toLowerCase()} review`)
    } finally {
      setModeratingId(null)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      case 'FLAGGED':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="bg-white p-6 rounded-lg border">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Review Moderation</h1>

      {/* Status Filter */}
      <div className="bg-white p-6 rounded-lg border mb-6">
        <h2 className="text-lg font-semibold mb-4">Filter by Status</h2>
        <div className="flex space-x-2">
          {['PENDING', 'FLAGGED', 'APPROVED', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setSelectedStatus(status)
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="bg-white p-12 rounded-lg border text-center">
          <Flag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No {selectedStatus.toLowerCase()} reviews
          </h3>
          <p className="text-gray-600">
            There are no reviews with {selectedStatus.toLowerCase()} status at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg border">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(review.status)}`}>
                      {review.status}
                    </span>
                    <div className="flex">{renderStars(review.rating)}</div>
                  </div>

                  <h3 className="font-semibold text-gray-900">{review.product.name}</h3>
                  <p className="text-sm text-gray-600">by {review.product.brand.name}</p>

                  <div className="flex items-center space-x-2 mt-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {review.user.name || 'Anonymous'} ({review.user.email})
                    </span>
                  </div>

                  {review.comment && (
                    <p className="mt-3 text-gray-700 italic">"{review.comment}"</p>
                  )}
                </div>

                {(review.status === 'PENDING' || review.status === 'FLAGGED') && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleModeration(review.id, 'APPROVED')}
                      disabled={moderatingId === review.id}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleModeration(review.id, 'REJECTED')}
                      disabled={moderatingId === review.id}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 border rounded-md disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 border rounded-md disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
} 