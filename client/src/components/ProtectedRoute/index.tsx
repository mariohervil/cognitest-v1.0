import Error401 from '@/components/Errors/401';

import useAuthStore from '@/hooks/useAuthStore';

interface ProtectedProps {
	children: React.ReactNode;
}

// Es una ruta protegida, si no hay una sesión activa, se redirige a la página de error 401
const ProtectedRoute = ({ children }: ProtectedProps) => {
	const session = useAuthStore((state) => state.session);
	if (!session) {
		return <Error401 />;
	} else return <>{children}</>;
};

export default ProtectedRoute;
