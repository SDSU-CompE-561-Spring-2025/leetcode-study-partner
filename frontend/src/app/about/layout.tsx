'use client';
import React from 'react';

import Link from 'next/link';

export default function SupportLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex flex-col justify-center items-center">
			<p className="w-full text-white-800 text-base">
				Have questions?{' '}
				<Link href="/about/contact" className="text-blue-600 underline hover:text-blue-800">
					Contact us here
				</Link>
				.
			</p>
			{children}
		</div>
	);
}
