import useAuthStore from '@/hooks/useAuthStore';
import { ReactNode } from 'react';

interface SignedInProps {
	children: ReactNode;
}
/*
	Esta página se encarga de renderizar los componentes hijos si el usuario está autenticado, no está autenticado o es administrador.
	Esto es necesario para proteger las rutas de la aplicación.
	Para llevar a cabo esta tarea, se utiliza el estado global: la sesión del usuario y el rol del usuario.
	Es una mini librería de componentes de nuestra propia creación.
*/

// Este componente se encarga de renderizar los componentes hijos si el usuario está autenticado.
const SignedIn = ({ children }: SignedInProps) => {
	const session = useAuthStore((state) => state.session);

	if (session) return <>{children}</>;
	else return <></>;
};

// Este componente se encarga de renderizar los componentes hijos si el usuario no está autenticado.
const SignedOut = ({ children }: SignedInProps) => {
	const session = useAuthStore((state) => state.session);
	if (!session) return <>{children}</>;
	else return <div className="hidden"></div>;
};

// Este componente se encarga de renderizar los componentes hijos si el usuario está autenticado y es administrador.
const Admin = ({ children }: SignedInProps) => {
	const session = useAuthStore((state) => state.session);

	if (session?.role && session?.role >= 1) return <>{children}</>;
	else return <div className="hidden"></div>;
};

export { SignedIn, SignedOut, Admin };
