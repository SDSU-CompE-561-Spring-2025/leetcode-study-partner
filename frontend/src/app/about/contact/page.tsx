import React from 'react';

export default function ContactPage() {
	return (
		<div className="bg-gray p-6 rounded-lg shadow-md border border-gray-200">
			<h1 className="text-3xl font-bold">Contact Us</h1>
			<p className="text-base">
				Have any questions? Fill out the form and we'll get back to you.
			</p>

			<form className="space-y-4">
				{/* Name Field (optional) */}
				<div>
					<label htmlFor="name" className="text-base font-bold bg-gray p-2 rounded-lg shadow-md border border-gray-200">
						Your Name
					</label>
					<input
						type="text"
						id="name"
						className="text-base mt-1 w-full rounded border-white-300 shadow-sm border border-gray-200 focus:border-blue-500 focus:ring-blue-500"
						placeholder="Jane Doe"
					/>
				</div>

				{/* Email Field */}
				<div>
					<label htmlFor="email" className="text-base font-bold bg-gray p-2 rounded-lg shadow-md border border-gray-200">
						Your Email
					</label>
					<input
						type="email"
						id="email"
						className="text-base mt-1 w-full rounded border-white-300 shadow-sm border border-gray-200 focus:border-blue-500 focus:ring-blue-500"
						placeholder="you@example.com"
					/>
				</div>

				{/* Message Box ✅ this is your email response box */}
				<div>
					<label htmlFor="message" className="text-base font-bold bg-gray p-2 rounded-lg shadow-md border border-gray-200">
						Your Message
					</label>
					<textarea
						id="message"
						rows={5}
						className="text-base mt-5 w-full rounded border-white-300 shadow-sm border border-gray-200 focus:border-blue-500 focus:ring-blue-500"
						placeholder="Type your message here..."
					></textarea>
				</div>

				{/* Submit Button */}
				<div>
					<button
						type="submit"
						className="text-base font-bold bg-gray p-2 rounded-lg shadow-md border border-gray-200"
					>
						Send Message
					</button>
				</div>
			</form>
		</div>
	);
}