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
				
				<Link href="/about/contact" className="text-blue-600 underline hover:text-blue-800">
					
				</Link>
				
			</p>
			{children}
		</div>
	);
}