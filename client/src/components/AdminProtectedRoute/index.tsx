import { UserInfo, useUser } from '@/hooks/useUser';
import Error403 from '@/components/Errors/403';
import Error401 from '@/components/Errors/401';
import { AxiosError } from 'axios';
import Loader from '@/components/Loader';
import { useEffect, useState } from 'react';
import useAuthStore from '@/hooks/useAuthStore';

interface ProtectedProps {
	children: React.ReactNode;

}

const AdminProtectedRoute = ({ children }: ProtectedProps) => {
	// const { user, error, loading } = useUser();
	// if (isLoading) return <div>Loading...</div>;

	const session = useAuthStore((state) => state.session);
	const error = useAuthStore((state) => state.error);
	if (!session) {
		console.log('User is null', session);
		return <Error401 />;
	} else if (session?.role && session?.role >= 1) return <>{children}</>;
	else return <Error403 />;
};

export default AdminProtectedRoute;
