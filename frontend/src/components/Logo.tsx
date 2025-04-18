import Image from 'next/image';
import Link from 'next/link';

function Logo() {
	return (
		<Link
			href={'/'}
			className={'flex items-center gap-2'}
		>
			<Image
				src="/meetcode.png"
				alt="Meet2Code Logo"
				width={44}
				height={44}
				className="rounded-full"
			/>
			<p
				className={
					'bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl leading-tight text-transparent'
				}
			>
				Meet2Code
			</p>
		</Link>
	);
}

export default Logo;
