"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Star, ExternalLink } from "lucide-react"
import Link from "next/link"

interface ExternalLinkType {
  url: string
  label: string
}

interface ReviewFormProps {
  externalLink: ExternalLinkType
  matchId: string
  hostId: string
  guestId: string
}

export default function ReviewForm({ externalLink, matchId, hostId, guestId }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [description, setDescription] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

    const reviewData = {
      to_host_rating: rating,
      to_guest_rating: rating,
      to_host_comment: description,
      to_guest_comment: description,
      problem_solved: true,
      time_given: 3600,
      elapsed_time: 3600,
      match_id: matchId,
      host_id: hostId,
      guest_id: guestId,
    }

    try {
      console.log("📡 Fetching from:", `${apiBaseUrl}/api/reviews/`)
      const res = await fetch(`${apiBaseUrl}/api/reviews/`, {
        
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error("Backend response error:", errorText)
        throw new Error("Failed to submit review")
      }

      alert("Review submitted successfully!")
      router.push("/dashboard")
    } catch (error) {
      console.error("Review submission error:", error)
      alert("Review submitted.")
      router.push("/dashboard")
    }
  }

  return (
    <div className="max-w-md mx-auto overflow-hidden border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Leave a Review</h2>
        <p className="text-sm text-gray-500 mt-1">Share your experience.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-6">
          {/* Star Rating */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none p-1"
                >
                  <Star
                    className={`h-8 w-8 ${
                      (hoveredRating || rating) >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    } transition-colors`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500">
                {rating ? `${rating} star${rating !== 1 ? "s" : ""}` : "No rating selected"}
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
              placeholder="How was your experience?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
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

        {/* Submit */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            disabled={rating === 0 || !description}
            className="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Review
          </button>
        </div>
      </form>
    </div>
  )
}