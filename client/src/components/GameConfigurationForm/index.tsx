import { useEffect, useState } from 'react';
import { IGameConfig } from '../../interfaces/IGameConfig';
import axios, { AxiosError, AxiosResponse } from 'axios';
import ImportModal from './modals/importmodal';
import SaveModal from './modals/savemodal';
import SuccessAlert from '../Alerts/SuccessAlert';
import ErrorAlert from '../Alerts/ErrorAlert';
import { useRouter } from 'next/router';
import { IPatient } from '../../../../server/src/models/patient.model';
import { toast } from 'react-hot-toast';
import { DropListPatient } from '@/interfaces/DropListPatient';
import { Admin } from '../UserStates';

const gameConfig: IGameConfig = {
	configName: '',
	gameName: 'Game',
	categories: 3,
	maxTries: 5,
	maxScorePerCategory: 8,
	maxTimePerGame: 300,
	maxSecondsPerQuestion: 20,
};

//En esta ruta /games/forms
const GameConfigForm = () => {
	const [gameConfigData, setGameConfigData] = useState<IGameConfig>(gameConfig);
	const [result, setResult] = useState<IGameConfig | IGameConfig[]>();
	const [successAlertVisibility, setSuccessAlertVisibility] = useState<boolean>(false);
	const [errorAlertVisibility, setErrorAlertVisibility] = useState<boolean>(false);
	const URL = 'http://localhost:8080/games/wordgame/config';
	const [buttonFlagUpdate, setButtonFlagUpdate] = useState<boolean>(false);
	const [patients, setPatients] = useState<DropListPatient[]>([]);
	const router = useRouter();

	useEffect(() => {}, [successAlertVisibility]);

	useEffect(() => {
		axios
			.get('http://localhost:8080/users/patients', { withCredentials: true })
			.then((response) => {
				setPatients(
					response.data.map((patient: IPatient) => ({
						_id: patient._id,
						fullName: (patient.firstName + ' ' + patient.lastName).trim().toUpperCase(),
					}))
				);
			})
			.catch((error) => {
				toast.error(error.response);
			});
	}, []);

	const handleInputChange = () => {
		return (event: React.ChangeEvent<HTMLInputElement>) => {
			setGameConfigData({
				...gameConfigData,
				[event.target.name]: Number.parseInt(event.target.value),
			});
		};
	};

	const resetGameConfig = () => {
		return async (event: any) => {
			const endpoint = event.target.name;

			await axios
				.get(`${URL}/${endpoint}`)
				.then((response: AxiosResponse) => {
					sessionStorage.setItem('gameConfig', response.data.gameConfig);
				})
				.catch((error: AxiosError) => {
					console.log(error);
				});
		};
	};

	// TODO: Plantear cuándo se debe hacer la petición de importar configuraciones, si al cargar la página o al pulsar el botón, o al cargar el modal
	// TODO: Enviar una función que actualice un estado que esté en el componente que hace la petición
	// TODO: para que se actualice el componente que muestra las configuraciones al eliminar una
	const importGameConfig = () => {
		return async (event: any) => {
			updateButtonFlag();
			const endpoint = event.target.nonce;

			await axios
				.get(`${URL}/${endpoint}`, {
					withCredentials: true,
				})
				.then((response: AxiosResponse) => {
					setResult(response?.data!);
				})
				.catch((error: AxiosError) => {
					console.log(error);
				});
		};
	};

	const updateButtonFlag = () => {
		setButtonFlagUpdate(!buttonFlagUpdate);
	};
	const updateGameConfig = () => {
		return async (event: any) => {
			const endpoint = event.target.name;
			axios
				.put(`${URL}/${endpoint}`, { gameConfig: gameConfigData })
				.then((response: AxiosResponse) => {})
				.catch((error: AxiosError) => {
					console.log(error);
				});
		};
	};

	const applyGameConfig = () => {
		return (event: any) => {
			localStorage.setItem('gameConfig', JSON.stringify(gameConfigData));
			console.log(localStorage.getItem('gameConfig'));
			const queryParams = new URLSearchParams(Object.entries(gameConfigData)).toString();
			router.push('games/wordgame?' + queryParams);
		};
	};

	const openSuccessAlert = () => {
		setSuccessAlertVisibility(true);
	};

	const closeSuccessAlert = () => {
		setSuccessAlertVisibility(false);
	};

	const openErrorAlert = () => {
		setErrorAlertVisibility(true);
	};

	const closeErrorAlert = () => {
		setErrorAlertVisibility(false);
	};

	return (
		<>
			<ImportModal configs={result as IGameConfig[]} buttonFlagUpdate={buttonFlagUpdate} />
			<Admin>
				<SaveModal
					config={gameConfigData}
					openSuccessAlert={openSuccessAlert}
					closeSuccessAlert={closeSuccessAlert}
					openErrorAlert={openErrorAlert}
					closeErrorAlert={closeErrorAlert}
					patients={patients}
				/>
			</Admin>
			<form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2">Categories</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="categories"
						type="number"
						placeholder="3"
						name="categories"
						onChange={handleInputChange()}
					/>
				</div>
				<div className="mb-6">
					<label className="block text-gray-700 text-sm font-bold mb-2">Max Tries</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						type="number"
						placeholder="5"
						name="maxTries"
						onChange={handleInputChange()}
					/>
				</div>
				<div className="mb-6">
					<label className="block text-gray-700 text-sm font-bold mb-2">
						Max Score Per Category
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="maxScorePerCategory"
						type="number"
						placeholder="8"
						name="maxScorePerCategory"
						onChange={handleInputChange()}
					/>
				</div>

				<div className="mb-6">
					<label className="block text-gray-700 text-sm font-bold mb-2">
						Max time per Game
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="maxTimePerGame"
						type="number"
						placeholder="300"
						name="maxTimePerGame"
						onChange={handleInputChange()}
					/>
				</div>
				<div className="mb-6">
					<label className="block text-gray-700 text-sm font-bold mb-2">
						Max Seconds Per Question
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="maxSecondsPerQuestion"
						type="number"
						placeholder="20"
						name="maxSecondsPerQuestion"
						onChange={handleInputChange()}
					/>
				</div>
				<div className="flex lg:flex-row justify-center flex-col gap-5">
					<Admin>
						<label htmlFor="my-modal" className="btn btn-primary">
							Guardar
						</label>
					</Admin>
					<button
						className="btn btn-primary"
						onClick={resetGameConfig()}
						name="reset"
						type="button"
					>
						Reset
					</button>
					<label
						htmlFor="import-modal"
						className="btn btn-primary"
						onClick={importGameConfig()}
						nonce="import"
					>
						Importar
					</label>
					<button
						className="btn btn-primary"
						onClick={applyGameConfig()}
						name="apply"
						type="button"
					>
						Aplicar
					</button>
				</div>
			</form>
			<SuccessAlert visibility={successAlertVisibility} />
			<ErrorAlert visibility={errorAlertVisibility} />
		</>
	);
};

export default GameConfigForm;
