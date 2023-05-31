import { ReactNode } from 'react';
import { useUser } from '@/hooks/useUser';
import Loader from '@/components/Loader';
import useAuthStore from '@/hooks/useAuthStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface AuthProviderProps {
	children: ReactNode;
}

// Crea un provider para envolver la aplicación y así poder acceder a la sesión del usuario en cualquier parte de la aplicación.
function AuthProvider({ children }: AuthProviderProps) {
	// Si existe una sesión, renderiza la aplicación.
	if (useAuthStore.getState().session) {
		return <>{children}</>;
	}

	// Si no existe una sesión, renderiza el loader mientras se pide la sesión al servidor.
	const { user } = useUser();
	if (useAuthStore.getState().loading)
		return (
			<>
				<Header />
				<div className="bg-gray-200">
					<Loader />
				</div>
				<Footer />
			</>
		);

	// Una vez se obtiene la sesión, renderiza la aplicación y guarda la sesión en el estado global.
	if (user) {
		useAuthStore.setState({ session: user });
	}
	return <>{children}</>;
}

export { AuthProvider };
