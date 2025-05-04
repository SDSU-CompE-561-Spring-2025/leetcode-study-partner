import ReviewForm from "./review-form"

export default async function ReviewPage() {
  // This would typically come from your database or API
  const externalLink = {
    url: "https://example.com/product",
    label: "View solution on LeetCode",
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <ReviewForm externalLink={externalLink} />
    </div>
  )
}