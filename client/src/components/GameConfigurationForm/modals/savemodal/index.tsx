import axios, { AxiosResponse } from 'axios';
import { IGameConfig } from '../../../../interfaces/IGameConfig';
import { useState } from 'react';
import { IPatient } from '../../../../../../server/src/models/patient.model';
import { PatientDropList } from '@/components/PatientDropList';
import { DropListPatient } from '@/interfaces/DropListPatient';
import { toast } from 'react-hot-toast';

export interface SaveModalProps {
	config: IGameConfig;
	openSuccessAlert: () => void;
	closeSuccessAlert: () => void;
	openErrorAlert: () => void;
	closeErrorAlert: () => void;
	patients: DropListPatient[];
}

function SaveModal(props: SaveModalProps) {
	const URL = 'http://localhost:8080/games/wordgame/config/save';
	const [name, setName] = useState<string>();
	const gameConfig = props.config;
	const { patients } = props;
	const [selectedPatient, setSelectedPatient] = useState<string>();

	const closeModal = () => {
		const toggle = document.querySelector('.modal-toggle') as HTMLInputElement;
		toggle.checked = false;
	};

	const saveConfig = () => {
		if (!name) {
			toast.error('El nombre de la configuración está vacío');
			return null;
		}
		if (!selectedPatient) {
			toast.error('Tienes que seleccionar un paciente!');
			return null;
		}
		gameConfig.configName = name;
		const input = document.querySelector('#configName') as HTMLInputElement;
		if (input) {
			input.value = '';
		}
		const patientId = patients.find(
			(patient) => patient.fullName.toUpperCase() === selectedPatient.toUpperCase()
		)?._id;

		axios
			.post(
				URL,
				{ gameConfig: gameConfig, patientId: patientId },
				{
					withCredentials: true,
				}
			)
			.then((response: AxiosResponse) => {
				if (response.status >= 200 && response.status < 300) {
					closeModal();
					toast.success('Configuración guardada con éxito!');
				}
			})
			.catch((reason) => {
				console.log(reason);
				closeModal();
				toast.error('Error al guardar la configuración');
			});
	};

	return (
		<>
			<input type="checkbox" id="my-modal" className="modal-toggle" />
			<div className="modal">
				<div className="modal-box">
					<label
						htmlFor="my-modal"
						className="btn btn-sm btn-accent btn-circle absolute right-2 top-2"
					>
						✕
					</label>
					<h3 className="font-bold text-lg">Define un nombre para la configuración!</h3>
					<input
						type="text"
						className="my-4 input input-bordered w-full max-w-xs focus:outline-primary focus:border-none"
						name="configName"
						id="configName"
						onChange={(e) => setName(e.target.value)}
					/>

					<PatientDropList
						selectedPatient={selectedPatient!}
						setSelectedPatient={setSelectedPatient}
						patients={patients}
					/>

					<div className="modal-action">
						<label
							htmlFor="my-modal"
							className="btn btn-primary"
							onClick={() => saveConfig()}
						>
							Confirmar
						</label>
					</div>
				</div>
			</div>
		</>
	);
}

export default SaveModal;
