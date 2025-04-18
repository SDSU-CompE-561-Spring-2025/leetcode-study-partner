import React from 'react';

function AboutPage() {
	return (
		<div className="p-8 max-w-5xl mx-auto">
			{/* Main Headers */}
			<h1 className="text-4xl font-bold mb-2 text-center">What is Meet2Code?</h1>
			

			{/* Side-by-side section */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div>
					<h3 className="text-3xl font-bold mb-4">About Us</h3>
					<p className="text-3xl text-white-600 leading-relaxed">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
						Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
					</p>
				</div>

				<div>
					<h3 className="text-3xl font-bold mb-4">Benefits</h3>
					<p className="text-3xl text-white-600 leading-relaxed">
						Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
						Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
					</p>
				</div>
			</div>
		</div>
	);
}

export default AboutPage;
