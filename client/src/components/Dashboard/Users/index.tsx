import { useState } from 'react';
import { IUser } from '../../../../../server/src/models/user.model';
import { IPatient } from '../../../../../server/src/models/patient.model';
import { PatientList } from '../Users/PatientList';
import { UserList } from '../Users/UserList';

export interface UserManagementProps {
	users: IUser[];
	patients: IPatient[];
	flagUpdate: () => void;
}

const UserManagement = (props: UserManagementProps) => {
	const [showingUsersOrPatients, setShowingUsers] = useState(false);
	const { users, patients, flagUpdate } = props;
	return (
		<div className="bg-white shadow rounded-lg p-6 flex flex-col gap-5">
			<div className="flex justify-start items-center">
				<div className="flex items-center space-x-4">
					<label className="text-gray-500 font-medium">Mostrar:</label>
					<button
						className={`rounded-full py-1 px-4 font-medium focus:outline-none ${
							showingUsersOrPatients ? 'bg-gray-200' : 'bg-white'
						}`}
						onClick={() => setShowingUsers(true)}
					>
						Usuarios
					</button>
					<button
						className={`rounded-full py-1 px-4 font-medium focus:outline-none ${
							showingUsersOrPatients ? 'bg-white' : 'bg-gray-200'
						}`}
						onClick={() => setShowingUsers(false)}
					>
						Pacientes
					</button>
				</div>
			</div>

			{showingUsersOrPatients ? (
				<UserList users={users} flagUpdate={flagUpdate} />
			) : (
				<PatientList patients={patients} flagUpdate={flagUpdate} />
			)}
		</div>
	);
};

export default UserManagement;
