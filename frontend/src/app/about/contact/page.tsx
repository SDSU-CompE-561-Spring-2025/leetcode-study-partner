'use client';
import { useState } from 'react';
import React from 'react';
import emailjs from '@emailjs/browser';

export default function ContactPage() {
	const [form, setForm] = useState({
		name: '',
		email: '',
		message: '',
	});
	const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setForm({ ...form, [e.target.id]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setStatus('sending');

		try {
			// Example: Send to a backend endpoint or 3rd-party API
			const res = await emailjs.send(
				'service_zfa62jm',         // ✅ your service ID
				'template_ftnd623', // ✅ your template ID
				{
					from_name: form.name,
					from_email: form.email,
					message: form.message,
				},
				'ZaDPHw1UEkMQmt2Nl' // ✅ your public key from EmailJS
			);


			console.log ('Email sent:', res.text);
			setStatus('sent');
			alert('Message sent successfully! ✅');
			setForm({ name: '', email: '', message: '' });
		} catch (error) {
			console.error('Error sending message:', error);
			setStatus('error');
			alert('Something went wrong. Please try again.');
		}
	};
	
	return (
		<div className="bg-gray p-6 rounded-lg shadow-md border border-gray-200">
			<h1 className="text-3xl font-bold">Contact Us</h1>
			<p className="text-base">
				Have any questions? Fill out the form and we'll get back to you.
			</p>

			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Name Field (optional) */}
				<div>
					<label htmlFor="name" className="text-base font-bold bg-gray p-2 rounded-lg shadow-md border border-gray-200">
						Your Name
					</label>
					<input
						value = {form.name}
						onChange={handleChange}
						required
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
						value = {form.email}
						onChange={handleChange}
						required
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
						value = {form.message}
						onChange={handleChange}
						required
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
						disabled={status === 'sending'}
					>
						{status === 'sending' ? 'Sending...' : 'Send Message'}
					</button>

				</div>
			</form>
		</div>
	);
}