import { ReactNode } from 'react';
import { useUser } from '@/hooks/useUser';
import Loader from '@/components/Loader';
import useAuthStore from '@/hooks/useAuthStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface AuthProviderProps {
	children: ReactNode;
}
// Define your initial state and reducer function
type Session = {
	isLoggedIn: boolean;
	username: string;
	firstName: string;
	lastName: string;
	role: number;
};

// Create a provider to provide your context object to all children
function AuthProvider({ children }: AuthProviderProps) {
	if (useAuthStore.getState().session) {
		return <>{children}</>;
	}
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
	if (user) {
		useAuthStore.setState({ session: user });
	}
	return <>{children}</>;
}

export { AuthProvider };
