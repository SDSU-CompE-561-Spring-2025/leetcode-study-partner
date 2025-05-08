'use client';

import { useState } from 'react';
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
      const res = await emailjs.send(
        'service_zfa62jm',
        'template_ftnd623',
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
        'ZaDPHw1UEkMQmt2Nl'
      );

      console.log('Email sent:', res.text);
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
    <section className="w-full min-h-screen flex items-center justify-center bg-background py-12 md:py-24 lg:py-32">
      <div className="w-full max-w-2xl space-y-6 px-4 text-center">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Get in Touch</h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Have a question, forgot your password, or have another issue? 
            < br/>
            Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 text-left">
              <label htmlFor="name" className="font-medium text-sm">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
            <div className="space-y-2 text-left">
              <label htmlFor="email" className="font-medium text-sm">Email</label>
              <input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          </div>
          <div className="space-y-2 text-left">
            <label htmlFor="message" className="font-medium text-sm">Message</label>
            <textarea
              id="message"
              placeholder="How can we help you?"
              rows={5}
              value={form.message}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full bg-primary text-black text-sm font-semibold px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 transition"
          >
            {status === 'sending' ? 'Sending...' : 'Submit'}
          </button>
        </form>
      </div>
    </section>
  );
}