import Error403 from '@/components/Errors/403';
import Error401 from '@/components/Errors/401';
import useAuthStore from '@/hooks/useAuthStore';

interface ProtectedProps {
	children: React.ReactNode;
}

// Este componente se encarga de proteger las rutas que solo pueden ser accedidas por usuarios administradores.
const AdminProtectedRoute = ({ children }: ProtectedProps) => {
	// Obtiene la sesión del usuario y el error del estado global.
	const session = useAuthStore((state) => state.session);
	const error = useAuthStore((state) => state.error);

	// Si existe un error, renderiza el componente de error 401.
	if (error) {
		return <Error401 />;
	}

	// Si no existe una sesión, renderiza el componente de error 401.
	if (!session) {
		console.log('User is null', session);
		return <Error401 />;
	}

	// Si el rol del usuario es mayor o igual a 1, renderiza la aplicación.
	else if (session?.role && session?.role >= 1) return <>{children}</>;
	// Si el rol del usuario es menor a 1, renderiza el componente de error 403.
	else return <Error403 />;
};

export default AdminProtectedRoute;
