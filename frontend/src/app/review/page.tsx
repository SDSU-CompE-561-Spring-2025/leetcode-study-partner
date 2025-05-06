import ReviewForm from "./review-form"

export default function ReviewPage() {
  const externalLink = {
    url: "https://leetcode.com/problems/example-problem",
    label: "View solution on LeetCode",
  }

  // Replace these with actual UUIDs from your backend/database
  const hostId = "c9c3b53f-6719-4c33-9f02-1927bdfb9ed9"
  const guestId = "e1483f9a-2dfc-4dbb-b7c3-5c1262b4a01c"
  const matchId = "a5b7c542-3aaf-4b7a-a0b2-4ec1d07bb3e4"

  return (
    <div className="container mx-auto py-10 px-4">
      <ReviewForm
        externalLink={externalLink}
        hostId={hostId}
        guestId={guestId}
        matchId={matchId}
      />
    </div>
  )
}