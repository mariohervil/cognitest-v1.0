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
	// Es la URL del endpoint que guarda la configuración en la base de datos
	const SAVE_CONFIG_URL = 'http://localhost:8080/games/wordgame/config/save';

	// Es el nombre de la configuración que se va a guardar
	const [name, setName] = useState<string>();

	// Es la configuración del juego que se va a guardar, se obtiene de las props
	const gameConfig = props.config;

	// Es la lista de pacientes que se obtiene de las props, se usa para mostrarla en el modal, en el desplegable de pacientes
	const { patients } = props;

	// Es el paciente seleccionado en el desplegable de pacientes
	const [selectedPatient, setSelectedPatient] = useState<string>();

	// Función que se ejecuta cuando se guarda la configuración
	const closeModal = () => {
		const toggle = document.querySelector('.modal-toggle') as HTMLInputElement;
		toggle.checked = false;
	};

	// Función para guardar la configuración, se ejecuta cuando se pulsa el botón de guardar y se comprueban los campos, si todo es correcto se hace la petición al servidor
	// para guardar la configuración en la base de datos y se cierra el modal, se muestra un toast de éxito o de error dependiendo de si se ha guardado correctamente o no
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
		// Busca el id del paciente seleccionado en la lista de pacientes y lo guarda en un campo de id de paciente para que la configuración se guarde para ese paciente
		const patientId = patients.find(
			(patient) => patient.fullName.toUpperCase() === selectedPatient.toUpperCase()
		)?._id;

		axios
			.post(
				SAVE_CONFIG_URL,
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
