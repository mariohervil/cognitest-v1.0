import Error401 from '@/components/Errors/401';

import useAuthStore from '@/hooks/useAuthStore';

interface ProtectedProps {
	children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedProps) => {
	const session = useAuthStore((state) => state.session);
	const error = useAuthStore((state) => state.error);
	if (!session) {
		return <Error401 />;
	} else return <>{children}</>;
};

export default ProtectedRoute;
