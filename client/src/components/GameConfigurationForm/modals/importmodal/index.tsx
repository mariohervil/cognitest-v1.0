import { useEffect, useState } from 'react';
import { IGameConfig, IResults } from '../../../../interfaces/IGameConfig';
import ModalCard from '../../card';
import axios from 'axios';

const IMPORT_URL = 'http://localhost:8080/games/wordgame/config/import';

function ImportModal(props: IResults) {
	const [configs, setConfig] = useState<IGameConfig[]>([]);
	const [updateFlag, setUpdateFlag] = useState(false);
	const { buttonFlagUpdate } = props;
	const flagUpdate = () => {
		setUpdateFlag(!updateFlag);
	};

	useEffect(() => {
		axios
			.get(IMPORT_URL, { withCredentials: true })
			.then((response) => {
				setConfig(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [updateFlag, buttonFlagUpdate]);

	if (!configs) {
		return <></>;
	}

	return (
		<div>
			{/* TODO: Quitar botón de aplicar, solamente editar. Para seleccionar la configuración,
			clicar en la tarjeta, que se cambia el fondo o el borde al color primario de la aplicación.
			*/}

			<input type="checkbox" id="import-modal" className="modal-toggle" />
			<div className="modal">
				<div className="modal-box w-max max-w-screen-2xl">
					<label
						htmlFor="import-modal"
						className="btn btn-sm btn-accent btn-circle absolute right-2 top-2"
					>
						✕
					</label>
					<h3 className="font-bold text-4xl text-center mb-3">Configuraciones</h3>
					<div className="flex gap-4 flex-wrap content-center py-10">
						{configs?.map((config) => (
							<ModalCard
								key={config.id}
								gameConfig={config}
								flagUpdate={flagUpdate}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default ImportModal;
