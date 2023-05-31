import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaBars, FaUser, FaTimes, FaUserMd, FaUserLock } from 'react-icons/fa';
import { UserInfo } from '../../hooks/useUser';
import useAuthStore from '@/hooks/useAuthStore';
export interface SidebarMenuProps {
	userInfo: UserInfo | null | undefined;
}

export interface AdminInfo {
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	profilePicture: string;
}

const SidebarMenu = () => {
	const session = useAuthStore((state) => state.session);
	const [isExpanded, setIsExpanded] = useState(false);
	const [showToggle, setShowToggle] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowToggle(true);
		}, 100);
		return () => clearTimeout(timer);
	}, [isExpanded]);

	return (
		<div>
			<div
				className={`fixed top-0  left-0 w-72 bg-white h-full z-40 shadow-lg transform transition-all duration-300 ${
					isExpanded ? 'translate-x-0' : '-translate-x-full'
				}`}
			>
				<div className="py-4 px-6">
					<ul className="text-lg flex flex-col gap-4">
						<li className="text-center">{session?.firstName.toUpperCase()}</li>
						<li className="flex flex-row justify-center">
							<div className={'border border-primary rounded-full p-4'}>
								{session?.role === 1 && (
									<>
										<FaUserMd size={30} />
									</>
								)}
								{session?.role === 2 && <FaUserLock size={30} />}
								{session?.role === 0 && <FaUser size={30} />}
							</div>
						</li>

						<li className="mb-4 flex flex-row justify-center">
							{session?.firstName} {session?.lastName}
						</li>

						<li className="mb-4">
							<Link
								href="/dashboard"
								className=" xl:text-sm text-lg text-gray-600 hover:text-gray-800"
							>
								Panel de Control
							</Link>
						</li>
						<li className="mb-4">
							<Link
								href="/dashboard/signup"
								className="xl:text-sm text-lg text-gray-600 hover:text-gray-800"
							>
								Registrar Usuario
							</Link>
						</li>
					</ul>
				</div>
				<button
					className="absolute top-6 right-6 rounded-full text-primary focus:outline-none"
					onClick={() => setIsExpanded(false)}
				>
					<FaTimes />
				</button>
			</div>
			{showToggle && (
				<button
					className={`fixed z-50 xl:top-6 top-16 left-6 rounded-full focus:outline-none text-primary ${
						isExpanded ? 'hidden' : 'block'
					}`}
					onClick={() => setIsExpanded(true)}
				>
					<FaBars />
				</button>
			)}
		</div>
	);
};

export default SidebarMenu;
