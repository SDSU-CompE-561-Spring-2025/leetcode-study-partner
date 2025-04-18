'use client';
import React from 'react';

import Link from 'next/link';
function AboutPage() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-8">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-6xl w-full">
				{/* Left: YouTube Embed */}
				<div className="w-full aspect-video">
					<iframe 
						width="560" 
						height="315" 
						src="https://www.youtube.com/embed/2-7eos40I74?si=GVnzAggh2Dz2bUXt" 
						title="YouTube video player" 
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						
					
					>
				
					</iframe>
				</div>

				{/* Right: Heading and Paragraph */}
				<div className="w-full text-white-800">
					<h1 className="text-4xl font-bold mb-4">About Us</h1>
					<p className="text-lg leading-relaxed">
						Meet2Code is a collaborative platform that allows users to practice solving LeetCode problems together. 
						Create an account, select preferences, and start matchmaking to improve at coding in real time! <br />
						<br />
						Watch our demo on the left to see it in action.
					</p>
				</div>

				

			</div>
		</div>
	);
}

export default AboutPage;
