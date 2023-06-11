import * as logo from '@/assets/logo.webp';
import { Admin } from '@/components/UserStates';
import Image from 'next/image';
import Link from 'next/link';
import NavBar from '@/components/SideMenu';
const Main = () => {
	return (
		<div className="hero min-h-screen bg-gray-200">
			<Admin>
				<NavBar />
			</Admin>
			<div className="hero-content text-center">
				<div className="max-w-md flex flex-col">
					<h1 className="text-5xl font-bold">Bienvenido a CogniTest</h1>
					<p className="py-6">
						Explora tus mejoras y capacidades en rehabilitación con CogniTest, una
						plataforma innovadora diseñada para medir tu progreso de manera precisa. Con
						nuestras pruebas cognitivas especializadas, podrás evaluar tus habilidades
						cognitivas y seguir de cerca tu evolución en tiempo real.
					</p>
					<div className="flex flex-row justify-center">
						<Link href="/auth">
							<button className="btn btn-primary">Empezar</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Main;
