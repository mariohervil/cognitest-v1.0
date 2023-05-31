import { useState } from 'react';
import ss from '../../../../ss.png'; // Asegúrate de que la ruta de la imagen sea correcta
import Image from 'next/image';
import GameConfigForm from '../../components/GameConfigurationForm/';
import SidebarConfig from '../../components/SideForm/';
import { FaTimes } from 'react-icons/fa';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useUser } from '@/hooks/useUser';
import NavBar from '@/components/SideMenu';
import { Admin } from '@/components/UserStates';
const GameList = () => {
	const [open, setOpen] = useState(false);
	return (
		<div className="bg-gray-200">
			<ProtectedRoute>
				<Admin>
					<NavBar />
				</Admin>
				<div className="drawer h-max min-h-screen drawer-end">
					<input
						id="my-drawer"
						type="checkbox"
						className="drawer-toggle"
						checked={open}
					/>
					<div className="drawer-content flex flex-col mt-5 mx-5">
						<Image
							src={ss}
							alt={'Screenshot del juego de las palabras'}
							className={
								'object-fill mx-8 border-secondary rounded-xl border-2 select-none cursor-pointer flex-initial max-w-full xs:max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl  w-80'
							}
							priority={true}
							onClick={() => setOpen(!open)}
						/>
					</div>
					<div className="drawer-side">
						<label htmlFor="my-drawer" className="drawer-overlay"></label>
						<ul className="menu p-4 xl:w-2/5 w-full h-full bg-base-100 text-base-content">
							<div className="flex flex-row justify-end">
								<button
									className="bg-accent rounded-full text-white p-2"
									onClick={() => setOpen(false)}
								>
									<FaTimes />
								</button>
							</div>
							<SidebarConfig />
						</ul>
					</div>
				</div>
			</ProtectedRoute>
		</div>
	);
};

export default GameList;
