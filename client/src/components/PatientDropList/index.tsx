import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/Button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '@/components/Command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Popover';
import { useEffect, useState } from 'react';
import { IPatient } from '../../../../server/src/models/patient.model';
import { DropListPatient } from '@/interfaces/DropListPatient';

interface PatientDropListProps {
	patients: DropListPatient[];
	selectedPatient: string;
	setSelectedPatient: (patient: string) => void;
}

// Este componente es el desplegable de pacientes que se usa en el modal de guardar configuración
/**
 *
 * @param props pacientes, selectedPatient, setSelectedPatient
 * setSelectedPatient es la función que se ejecuta cuando se selecciona un paciente en el desplegable, actualiza el estado de selectedPatient, que es el paciente seleccionado
 */
const PatientDropList = ({
	patients,
	setSelectedPatient,
	selectedPatient,
}: PatientDropListProps) => {
	// Booleano que indica si el desplegable está abierto o no
	const [open, setOpen] = useState(false);

	// El JSX que se muestra, está hecho con una librería de componentes llamada ShadCN, se usa para hacer el desplegable acoplando varios componentes
	// incluye una barra de búsqueda y una lista de pacientes, si volvemos a clicar en el paciente seleccionado se deselecciona y vuelve al estado inicial
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{selectedPatient
						? patients.find(
								(patient) => patient.fullName === selectedPatient.toUpperCase()
						  )?.fullName
						: 'Elige un paciente'}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder="Busca un paciente..." />
					<CommandEmpty>No hay pacientes.</CommandEmpty>
					<CommandGroup>
						{patients.map((patient) => (
							<CommandItem
								key={patient._id}
								onSelect={(currentValue) => {
									setSelectedPatient(
										currentValue === selectedPatient ? '' : currentValue
									);
									setOpen(false);
								}}
							>
								<Check
									key={patient._id}
									className={cn(
										'mr-2 h-4 w-4',
										selectedPatient === patient.fullName
											? 'opacity-100'
											: 'opacity-0'
									)}
								/>
								{patient.fullName}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export { PatientDropList };
