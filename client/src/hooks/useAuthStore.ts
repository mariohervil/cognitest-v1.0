import { create } from 'zustand';

export type Session = {
	isLoggedIn: boolean;
	username: string;
	firstName: string;
	lastName: string;
	role: number;
};

interface AuthState {
	session: Session | null;
	login: (session: Session) => void;
	logout: () => void;
	loading: boolean;
	error: any;
}

const useAuthStore = create<AuthState>((set) => ({
	session: null, // Initial state, user is not logged in
	login: (session: Session) => set({ session }), // Action to log in
	logout: () => set({ session: null }), // Action to log out
	loading: true, // Initial state, loading
	error: null, // Initial state, no error
}));

export default useAuthStore;
