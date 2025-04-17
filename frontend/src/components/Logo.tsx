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
				alt="MeetCode Logo"
				width={44}
				height={44}
				className="rounded-full"
			/>
			<p
				className={
					'text-white text-3xl leading-tight'
				}
			>
				MeetCode
			</p>
		</Link>
	);
}

export default Logo;
