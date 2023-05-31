import { useState, useEffect, FormEvent } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { useUser } from '@/hooks/useUser';
import { toast } from 'react-hot-toast';
import useAuthStore from '@/hooks/useAuthStore';

const Auth = () => {
	// Nombre de usuario y contraseña
	const [username, handleUsername] = useState<string>('');
	const [password, handlePassword] = useState<string>('');

	// Router, fecha actual, función de inicio de sesión y sesión del estado global.
	const router = useRouter();
	const date = new Date();

	// Recogemos la función de inicio de sesión y la sesión del estado global.
	const login = useAuthStore((state) => state.login);
	const session = useAuthStore((state) => state.session);

	// Recogemos el usuario del estado global.
	// Esto es necesario para que cuando el usuario inicie sesión, se actualice el estado global. Ya que el estado no tiene persistencia.
	const { user } = useUser();

	useEffect(() => {
		// Si el usuario existe, inicia sesión y redirige a la página de juegos o al dashboard dependiendo del rol del usuario.
		if (user) {
			login({ ...user, isLoggedIn: true });
			router.push(`${user.role == 0 ? '/games' : '/dashboard'}`);
		}

		// Si el usuario ya está logueado, redirige a la página de juegos o al dashboard dependiendo del rol del usuario.
		if (session?.isLoggedIn && session?.role >= 1) {
			router.push('/dashboard');
		} else if (session?.isLoggedIn && session?.role == 0) {
			router.push('/games');
		}
	}, [user]);

	const validateForm = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Si el nombre de usuario y la contraseña no están vacíos, se envía la petición al servidor.
		if (username.length >= 0 || password.length >= 0) {
			axios
				.post(
					'http://localhost:8080/auth/login/',
					{
						username,
						password,
					},
					{
						// & Para enviar la cookie de la sesión al servidor.
						withCredentials: true,
					}
				)
				.then((res: AxiosResponse) => {
					// Inicia sesión y redirige a la página de juegos o al dashboard dependiendo del rol del usuario.
					login({
						isLoggedIn: true,
						username: res.data.username,
						firstName: res.data.firstName,
						lastName: res.data.lastName,
						role: res.data.role,
					});

					toast.success('Sesión iniciada correctamente');

					if (res.data.role >= 1) {
						router.push('/dashboard');
					} else {
						router.push('/games');
					}
				})
				.catch((error) => {
					// Si hay un error, muestra un mensaje de error.
					toast.error('Error al iniciar sesión');
				});
		}
		return false;
	};

	return (
		<>
			<div className="flex flex-row justify-center h-max min-h-screen bg-gray-200">
				<div className="flex flex-col justify-center gap-4">
					<form
						className="flex flex-col gap-4 bg-white shadow-md rounded px-8 pt-6 pb-8"
						onSubmit={(e) => validateForm(e)}
					>
						<div className="form-control w-full max-w-xs">
							<label className="label">
								<span className="label-text font-bold">Username</span>
							</label>
							<input
								onChange={(e) => handleUsername(e.target.value)}
								id="text"
								type="text"
								placeholder="Username"
								value={username}
								className="input input-bordered w-full max-w-xs focus:outline-primary focus:border-none"
							/>
						</div>

						<div className="form-control w-full max-w-xs">
							<label className="label">
								<span className="label-text font-bold">Password</span>
							</label>
							<input
								onChange={(e) => handlePassword(e.target.value)}
								id="password"
								type="password"
								placeholder="Password"
								value={password}
								className="input input-bordered w-full max-w-xs focus:outline-primary focus:border-none"
							/>
						</div>

						<div className="flex flex-col gap-4">
							<div className="flex items-center justify-between mt-4">
								<button className="btn btn-primary btn-wide" type="submit">
									Login
								</button>
							</div>
						</div>
					</form>
					<p className="text-center text-gray-500 text-xs">
						&copy;{date.getFullYear()} all rights reserved.
					</p>
				</div>
			</div>
		</>
	);
};

export default Auth;
