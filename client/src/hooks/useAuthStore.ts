import { create } from 'zustand';

// Session es el tipo de dato que va a tener la sesión
export type Session = {
	isLoggedIn: boolean;
	username: string;
	firstName: string;
	lastName: string;
	role: number;
};

// AuthState es el tipo de dato que va a tener el estado de la sesión
interface AuthState {
	// Marcamos la sesión como opcional porque al principio no hay sesión
	session: Session | null;
	// login y logout son las acciones que se van a poder hacer con el estado de la sesión
	login: (session: Session) => void;
	logout: () => void;
	// loading y error son los estados de carga y error, que se van a usar para mostrar un spinner de carga y un mensaje de error
	loading: boolean;
	error: any;
}

// useAuthStore es el hook que se va a usar para acceder al estado de la sesión, viene de la librería Zustand
const useAuthStore = create<AuthState>((set) => ({
	session: null, // Estado inicial de la sesión, null, porque al principio no hay sesión
	login: (session: Session) => set({ session }), // Acción para iniciar sesión
	logout: () => set({ session: null }), // Acción para cerrar sesión
	loading: true, // Estado de carga inicial, true
	error: null, // Estado de error inicial, null
}));

export default useAuthStore;
