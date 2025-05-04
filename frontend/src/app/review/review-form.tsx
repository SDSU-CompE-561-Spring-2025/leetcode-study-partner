"use client"

import type React from "react"
import { useState } from "react"
import { Star, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface ExternalLinkType {
  url: string
  label: string
}

interface ReviewFormProps {
  externalLink: ExternalLinkType
}

export default function ReviewForm({ externalLink }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [description, setDescription] = useState("")
  const router = useRouter()

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the review data to your backend
    
    console.log({ rating, description, referenceLink: externalLink.url })
    alert("Review submitted successfully!")
    // Reset form
    setRating(0)
    setDescription("")
    
    const reviewData = {

      // PLACEHOLDERS
      host_id: "HOST_UUID",    
      guest_id: "GUEST_UUID",  
      match_id: "MATCH_UUID", 
      rating,
      description,
    }

    // TRY CATCH to move to backend
    try {
      const res = await fetch("http://localhost:8000/api/reviews/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add Authorization header if needed:
          // "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(reviewData),
      })
  
      if (!res.ok) {
        throw new Error("Failed to submit review")
      }
  
      alert("Review submitted successfully!")
      router.push("/dashboard")
    } 
    catch (error) {
      console.error(error)
      alert("There was a problem submitting your review.")
      // Navigate to dashboard
      router.push("/dashboard")
    }

    
    
  }

  return (
    <div className="max-w-md mx-auto overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Leave a Review.</h2>
        <p className="text-sm text-white-200 mt-1">Share your experience.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <label htmlFor="rating-group" className="block text-sm font-medium">
              Rating
            </label>
            <div className="flex items-center gap-1" id="rating-group">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 p-1"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  aria-label={`${star} star${star !== 1 ? "s" : ""}`}
                >
                  <Star
                    className={`h-8 w-8 ${
                      (hoveredRating ? star <= hoveredRating : star <= rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    } transition-colors`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500">
                {rating > 0 ? `${rating} star${rating !== 1 ? "s" : ""}` : "No rating selected"}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              placeholder="How was your experience with the other user?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="font-medium w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* External Link */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Solution</label>
            <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-md">
              <ExternalLink className="h-4 w-4 text-gray-400" />
              <Link
                href={externalLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                {externalLink.label}
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            disabled={rating === 0 || !description}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Review
          </button>
        </div>
      </form>
    </div>
  )
}
