import { MouseEventHandler, createContext, useContext, useEffect, useState } from 'react';
import { IGameConfig, IResults } from '../../../interfaces/IGameConfig';
import ICardProps from '../../../interfaces/ICardProps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCancel,
	faCheck,
	faArrowAltCircleDown,
	faPencilAlt,
	faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FaCheck, FaBan, FaTrashAlt, FaArrowAltCircleDown, FaPencilAlt } from 'react-icons/fa';

import axios, { AxiosResponse, AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { Admin } from '@/components/UserStates';

const Card = (props: ICardProps) => {
	const [trash, setTrash] = useState<IGameConfig | IGameConfig[]>();
	const URL = 'http://localhost:8080/games/wordgame/config';
	const DELETE_URL = URL + '/delete';
	const UPDATE_URL = URL + '/update';
	const [config, setConfig] = useState<IGameConfig>();
	const [isEditing, setIsEditing] = useState(false);
	const [isCancelling, setIsCancelling] = useState(false);
	const [tempConfig, setTempConfig] = useState<IGameConfig>();
	const [isApplying, setIsApplying] = useState(config);
	const { flagUpdate } = props;
	const router = useRouter();

	useEffect(() => {
		setConfig(props.gameConfig);
		setTempConfig(props.gameConfig);
	}, [props]);

	const handleEditClick = () => {
		setIsEditing(true);
	};

	const handleUpdateClick = (event: any) => {
		const lastGameConfigName = props.gameConfig.id;
		console.log('ANTIGUA CONFIGURACION: ' + lastGameConfigName);
		console.log('NUEVO NOMBRE: ' + tempConfig?.configName);

		axios
			.put(
				UPDATE_URL,
				{ tempConfig, gameConfigId: lastGameConfigName },
				{
					withCredentials: true,
				}
			)
			.then((res: AxiosResponse) => {
				console.log(res);
				flagUpdate();
			})
			.catch((error: AxiosError) => {
				console.log(error);
			});

		setConfig(tempConfig);
		setIsEditing(false);
		setIsCancelling(false);
	};

	const handleCancelClick = () => {
		setIsEditing(false);
		setIsCancelling(false);
		//setConfig(props.gameConfig);//NO FUNCA cuando cancelas al volver a clicar deberia aparecer la configuracion inicial y no la temporal
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTempConfig({
			...tempConfig!,
			[event.target.name]: event.target.value,
		});
	};

	const handleDeleteClick = (event: any) => {
		console.log('ENDPOINT: ' + DELETE_URL);
		console.log('NOMBRE A BORRAR: ' + props.gameConfig.id);

		axios
			.delete(`${DELETE_URL}/${props.gameConfig.id}`, {
				withCredentials: true,
			})
			.then((res: AxiosResponse) => {
				console.log(res);
				flagUpdate();
			})
			.catch((error: AxiosError) => {
				console.log(error);
			});
	};

	const applyGameConfig = (event: any) => {
		localStorage.setItem('gameConfig', JSON.stringify(props.gameConfig));
		const queryParams = new URLSearchParams(Object.entries(props.gameConfig)).toString();
		router.push('games/wordgame?' + queryParams);
		// router.push('/games/wordgame?');
	};

	return (
		<div>
			<div
				className={
					'rounded-[10px] p-6 border-2 text-center fit-content break-words hover:bg-primary hover:text-primary-content'
				}
			>
				{isEditing ? (
					<input
						type="text"
						name="configName"
						maxLength={10}
						value={tempConfig?.configName}
						onChange={handleInputChange}
						className={
							'text-center bg-transparent w-20 h-5 p-2 border-none outline-none appearance-none -webkit-inner-spin-button -webkit-outer-spin-button'
						}
					/>
				) : (
					<h1 className="text-xl font-bold mb-2 ">{config?.configName}</h1>
				)}

				<div>
					<p>
						Categories:
						{isEditing ? (
							<input
								type="number"
								name="categories"
								value={tempConfig?.categories}
								onChange={handleInputChange}
								className={
									'text-center bg-transparent w-12 h-5 p-2 border-none outline-none appearance-none -webkit-inner-spin-button -webkit-outer-spin-button'
								}
							/>
						) : (
							<span> {config?.categories}</span>
						)}
					</p>
				</div>

				<div>
					<p>
						Max tries:
						{isEditing ? (
							<input
								type="number"
								name="maxTries"
								value={tempConfig?.maxTries}
								onChange={handleInputChange}
								className={
									'text-center bg-transparent w-12 h-5 p-2 border-none outline-none appearance-none -webkit-inner-spin-button -webkit-outer-spin-button'
								}
							/>
						) : (
							<span> {config?.maxTries}</span>
						)}
					</p>
				</div>

				<div>
					<p>
						Max Score Per Category:
						{isEditing ? (
							<input
								type="number"
								name="maxScorePerCategory"
								value={tempConfig?.maxScorePerCategory}
								onChange={handleInputChange}
								className={
									'text-center bg-transparent w-12 h-5 p-2 border-none outline-none appearance-none -webkit-inner-spin-button -webkit-outer-spin-button'
								}
							/>
						) : (
							<span> {config?.maxScorePerCategory}</span>
						)}
					</p>
				</div>

				<div>
					<p>
						Max Time Per Game:
						{isEditing ? (
							<input
								type="number"
								name="maxTimePerGame"
								value={tempConfig?.maxTimePerGame}
								onChange={handleInputChange}
								className={
									'text-center bg-transparent w-12 h-5 p-2 border-none outline-none appearance-none -webkit-inner-spin-button -webkit-outer-spin-button'
								}
							/>
						) : (
							<span> {config?.maxTimePerGame}</span>
						)}
					</p>
				</div>

				<div>
					<p>
						Max Seconds Per Question:
						{isEditing ? (
							<input
								type="number"
								name="maxSecondsPerQuestion"
								value={tempConfig?.maxSecondsPerQuestion}
								onChange={handleInputChange}
								className={
									'text-center bg-transparent w-12 h-5 p-2 border-none outline-none appearance-none -webkit-inner-spin-button -webkit-outer-spin-button'
								}
							/>
						) : (
							<span> {config?.maxSecondsPerQuestion}</span>
						)}
					</p>
				</div>
				<div style={{ marginTop: '5%' }}>
					{isEditing && (
						<div>
							<button
								className="bg-red-500 text-white rounded-md py-2 px-4 mb-4 mr-2"
								onClick={handleCancelClick}
							>
								<FaBan size={15} />
							</button>
							<button
								className="bg-green-500 text-white rounded-md py-2 px-4 mb-4"
								onClick={handleUpdateClick}
							>
								<FaCheck size={15} />
							</button>
						</div>
					)}
					{!isEditing && (
						<div>
							<Admin>
								<button
									className="bg-secondary text-white rounded-md py-2 px-4 mb-4"
									onClick={handleEditClick}
								>
									<FaPencilAlt />
								</button>
							</Admin>
							<Admin>
								<button
									type="button"
									className="bg-red-500 text-white rounded-md py-2 px-4 mb-4"
									onClick={(event) => handleDeleteClick(event)}
									name="delete"
								>
									<FaTrashAlt />
								</button>
							</Admin>
							<button
								type="button"
								className="bg-green-500 text-white rounded-md py-2 px-4 mb-4"
								onClick={(event) => applyGameConfig(event)}
								name="apply"
							>
								<FaArrowAltCircleDown />
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Card;
