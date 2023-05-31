import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { IPatient } from '../../../../../../server/src/models/patient.model';
import axios from 'axios';
import { useState } from 'react';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/Accordion/';
import { FaTrash, FaUser } from 'react-icons/fa';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface PatientListProps {
	patients: IPatient[];
	flagUpdate: () => void;
}
const DELETE_PATIENT_URL = 'http://localhost:8080/users/patients';
export function PatientList(props: PatientListProps) {
	const { patients } = props;
	const { flagUpdate } = props;
	const router = useRouter();

	const onDeletePatient = (patient: IPatient) => {
		axios
			.delete(`${DELETE_PATIENT_URL}/${patient._id}`, { withCredentials: true })
			.then((res) => {
				flagUpdate();
			})
			.catch((err) => {
				console.log(err);
			});
	};
	return (
		<div className="border rounded-lg p-4">
			{patients.length > 0 ? (
				<ul className="list-disc pl-4">
					{patients.map((patient: IPatient) => (
						<Accordion type="single" collapsible className="w-full" key={patient._id}>
							<AccordionItem value="item-1">
								<AccordionTrigger>
									{patient.firstName} {patient.lastName}
								</AccordionTrigger>
								<AccordionContent>
									<div className="flex flex-row gap-10">
										<FaTrash
											onClick={() => onDeletePatient(patient)}
											className={'cursor-pointer text-accent'}
										/>
										<Link href={`/results/${patient.username}`}>
											<FaUser className={'text-secondary'} />
										</Link>
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					))}
				</ul>
			) : (
				<p className="text-gray-500">No patients found</p>
			)}
		</div>
	);
}
