import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IPatient } from '../../../../server/src/models/patient.model';
import {IWordGame} from '../../interfaces/WordGame';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import SideMenu from '@/components/SideMenu';

const PatientProfile = () => {
	const router = useRouter();
	const [patient, setPatient] = useState<IPatient>();
	const { patient: patientUsername } = router.query;
	const [selectedResult, setSelectedResult] = useState<IWordGame | undefined>();
	useEffect(() => {
		const fetchPatient = async () => {
			const data = await fetch(
				`http://localhost:8080/users/patients/${patientUsername}`,

				{ credentials: 'include', method: 'GET' }
			);

			const patientObject = await data.json();

			console.log(patientObject);
			setPatient(patientObject);
		};

		fetchPatient();
	}, []);

	return (
		<AdminProtectedRoute>
			<SideMenu />
			<div className={'min-h-screen h-max bg-gray-200'}>
				<div className="container mx-auto px-4 py-8">
					<div className="bg-white rounded-lg shadow-md p-4 mb-4">
						<div className="flex flex-row justify-between">
							<div>
								<div className="flex items-center justify-start mb-4">
									<img
										className="w-16 h-16 object-cover rounded-full"
										src="https://via.placeholder.com/150"
										alt="User Avatar"
									/>
									<div className="ml-4">
										<h2 className="text-lg font-semibold">
											{patient?.firstName} {patient?.lastName}
										</h2>
										<p className="text-gray-500">{patient?.studies}</p>
										<p className="text-gray-500">
											{patient?.birthYear!.toString()}
										</p>
									</div>
								</div>
								<h3 className="text-md font-semibold mb-2">Results:</h3>

								<ul className="flex flex-wrap -mx-2">
									{patient?.results.map((result) => (
										<li className="p-2" key={result._id?.toString()}>
											<button
												key={result._id?.toString()}
												className="bg-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
												onClick={(e) => {
													setSelectedResult(result as IWordGame);
												}}
											>
												{result.gameName}
											</button>
										</li>
									))}
								</ul>
							</div>

							<div className="container w-1/3">
								{selectedResult && (
									<div className="bg-white rounded-lg shadow-md p-4 mb-4">
										<h3 className="text-md font-semibold mb-2">
											{selectedResult.gameName}
										</h3>
										<p className="text-gray-500 mb-2">
											Aciertos: {selectedResult.rightGuesses}
										</p>
										<p className="text-gray-500 mb-2">
											Fallos: {selectedResult.wrongGuesses}
										</p>
										<p className="text-gray-500 mb-2">
											Omisiones: {selectedResult.omissions}
										</p>
										<p className="text-gray-500 mb-2">
											Errores perseverativos:{' '}
											{selectedResult.perseverativeErrors}
										</p>
										<p className="text-gray-500 mb-2">
											Errores no perseverativos:{' '}
											{selectedResult.nonPerseverativeErrors}
										</p>
										<p className="text-gray-500 mb-2">
											Errores de mantenimiento del set:{' '}
											{selectedResult.setContinuationErrors}
										</p>
										<p className="text-gray-500 mb-2 ">
											Tiempo de respuesta:{' '}
											{selectedResult.responseTime.map((time, index) => {
												return (
													<span className="flex flex-col justify-center text-center">
														Ronda {index + 1}: {time}s
													</span>
												);
											})}
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</AdminProtectedRoute>
	);
};

export default PatientProfile;
