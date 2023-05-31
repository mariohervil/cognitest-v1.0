import Head from 'next/head';
import GameConfigForm from '../../../components/GameConfigurationForm/index';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useUser } from '@/hooks/useUser';

const Form = () => {
	return (
		<>
			<ProtectedRoute>
				<GameConfigForm />
			</ProtectedRoute>
		</>
	);
};

export default Form;
