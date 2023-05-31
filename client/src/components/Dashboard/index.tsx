import { useEffect, useState } from 'react';
import { IPatient } from '../../../../server/src/models/patient.model';
import { IUser } from '../../../../server/src/models/user.model';
import axios, { AxiosResponse } from 'axios';
import { UserInfo } from '../../hooks/useUser';
import NavBar from '@/components/SideMenu';
import UserManagement from '@/components/Dashboard/Users';

interface AdminDashboardProps {
	userData: UserInfo;
}

const AdminDashboard = ({ userData }: AdminDashboardProps) => {
	// true means users, false means patients

	const [users, setUsers] = useState<IUser[]>([]);
	const [patients, setPatients] = useState<IPatient[]>([]);
	const [updateFlag, setUpdateFlag] = useState<boolean>(true);
	const flagUpdate = () => {
		setUpdateFlag(!updateFlag);
	};

	useEffect(() => {
		axios
			.get('http://localhost:8080/users/users', { withCredentials: true })
			.then((res: AxiosResponse) => {
				setUsers(res.data);
			})
			.catch((err) => {
				console.log(err);
				return;
			});

		axios
			.get('http://localhost:8080/users/patients', { withCredentials: true })
			.then((res: AxiosResponse) => {
				setPatients(res.data);
			})
			.catch((err) => {
				console.log(err);
				return;
			});
	}, [updateFlag, userData]);

	return (
		<div className="bg-gray-200">
			<div className="container mx-auto px-4 my-auto">
				<NavBar />
				<div className="gap-8">
					<UserManagement patients={patients} users={users} flagUpdate={flagUpdate} />
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
