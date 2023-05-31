import { IUser } from '../../../../../../server/src/models/user.model';
import axios from 'axios';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FaTrash, FaUserLock, FaUserMd } from 'react-icons/fa';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/Accordion/';
import { toast } from 'react-hot-toast';
interface UserListProps {
	users: IUser[];
	flagUpdate: () => void;
}

const DELETE_USER_URL = 'http://localhost:8080/users/users';

export function UserList(props: UserListProps) {
	const { users, flagUpdate } = props;
	const onDeleteUser = (user: IUser) => {
		axios
			.delete(`${DELETE_USER_URL}/${user._id}`, { withCredentials: true })
			.then((res) => {
				flagUpdate();
				toast.success('Usuario eliminado correctamente');
			})
			.catch((err) => {
				toast.error(err.response.data);
			});
	};

	return (
		<div className="border rounded-lg p-4">
			{users.length > 0 ? (
				<ul className="list-disc pl-4">
					{users.map((user: IUser) => (
						<Accordion type="single" collapsible className="w-full" key={user._id}>
							<AccordionItem value="item-1">
								<AccordionTrigger>
									<div className="flex flex-row gap-5">
										<div>
											{user.firstName} {user.lastName}
										</div>
										<div className="align-middle">
											{user.role === 2 ? <FaUserLock /> : <FaUserMd />}
										</div>
									</div>
								</AccordionTrigger>
								<AccordionContent>
									<FaTrash
										onClick={() => onDeleteUser(user)}
										className={'cursor-pointer text-accent'}
									/>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					))}
				</ul>
			) : (
				<p className="text-gray-500">No users found</p>
			)}
		</div>
	);
}

/*

<div className="collapse">
  <input type="checkbox" />
  <div className="collapse-title text-xl font-medium">
    {account.firstName}
  </div>
  <div className="collapse-content" key={index}>
    <p>{ account.role === 2 ? 'Admin' : 'Doctor' }</p>
	<button className="text-red-500 ml-2" onClick={() => onDeleteUser(account.firstName)}>x</button>
  </div>
</div>







*/
