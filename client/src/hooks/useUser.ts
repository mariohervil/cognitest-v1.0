import { useEffect, useState, useCallback } from 'react';
import useAuthStore from './useAuthStore';

export type Session = {
	isLoggedIn: boolean;
	username: string;
	firstName: string;
	lastName: string;
	role: number;
};
export interface UserInfo {
	isLoggedIn: boolean;
	username: string;
	firstName: string;
	lastName: string;
	role: number;
}

const useUser = () => {
	const [user, setUser] = useState<UserInfo | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<any>(null);

	const checkSession = useCallback(async () => {
		try {
			const response = await fetch('http://localhost:8080/auth/session', {
				credentials: 'include',
			});
			const data = await response.json();
			setUser(data);
		} catch (err) {
			setError(err);
			useAuthStore.setState({ error: err });
		} finally {
			setLoading(false);
			useAuthStore.setState({ loading: false });
			useAuthStore.setState({ error: null });
		}
	}, []);

	useEffect(() => {
		checkSession();
		400;
	}, [checkSession]);

	return { user };
};

export { useUser };
