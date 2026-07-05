import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Header = () => {
	return (
		<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
			<div className='flex items-center gap-3'>
				<Link to='/' className='rounded-lg'>
					<img src='/spotify.png' className='size-8 sm:size-10 text-black' />
				</Link>
				<div>
					<h1 className='text-xl sm:text-2xl md:text-3xl font-bold'>Music Manager</h1>
					<p className='text-zinc-400 mt-1 text-sm sm:text-base'>Manage your music catalog</p>
				</div>
			</div>
			<div className='flex justify-end'>
				<UserButton />
			</div>
		</div>
	);
};
export default Header;
