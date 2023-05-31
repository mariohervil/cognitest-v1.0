import Link from 'next/link';
import { Admin, SignedIn, SignedOut } from '../UserStates';
import useAuthStore from '@/hooks/useAuthStore';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';

const Header = () => {
	const logout = useAuthStore((state) => state.logout);
	const session = useAuthStore((state) => state.session);
	const router = useRouter();
	const handleLogout = () => {
		axios
			.get('http://localhost:8080/auth/logout', { withCredentials: true })
			.then((res) => {
				router.push('/auth');
			})
			.catch((err) => {
				if (err.response.message === 'Already logged out') {
				} else toast.error('Error al cerrar sesión');
			});

		logout();
	};

	return (
		<header className="bg-gray-900 py-4">
			<nav className="container mx-auto px-4 flex items-center justify-between">
				<Link href={'/'}>
					<h1 className="text-white font-bold text-lg">CogniTest</h1>
				</Link>
				<ul className="flex space-x-4 text-xs md:text-sm xl:text-base">
					<li>
						<Link href="/">
							<span className="text-white hover:text-gray-300">Inicio</span>
						</Link>
					</li>
					<SignedIn>
						<li>
							<Link href="/games">
								<span className="text-white hover:text-gray-300">Juegos</span>
							</Link>
						</li>
					</SignedIn>
					<SignedIn>
						<li>
							<>
								<Link
									href="/auth"
									className="text-white hover:text-gray-300 cursor-pointer"
									onClick={() => handleLogout()}
								>
									Cerrar sesión
								</Link>
							</>
						</li>
					</SignedIn>

					<SignedOut>
						<li>
							<Link href="/auth">
								<span className="text-white hover:text-gray-300">
									Iniciar Sesión
								</span>
							</Link>
						</li>
					</SignedOut>
				</ul>
			</nav>
		</header>
	);
};

export default Header;
