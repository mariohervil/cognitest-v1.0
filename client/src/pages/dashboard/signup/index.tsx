import { NextPage } from 'next';
import SignUp from '../../../components/SignUp';
import AdminProtectedRoute from '../../../components/AdminProtectedRoute';
import NavBar from '../../../components/SideMenu';
import { useUser } from '../../../hooks/useUser';
const SignUpPage: NextPage = () => {


	return (
		<AdminProtectedRoute>
			<NavBar />
			<SignUp />
		</AdminProtectedRoute>
	);
};

export default SignUpPage;
