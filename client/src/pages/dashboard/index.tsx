import { UserInfo, useUser } from '@/hooks/useUser';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import AdminDashboard from '@/components/Dashboard';
import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import Loader from '@/components/Loader';
import Error401 from '@/components/Errors/401';
const DashboardPage = () => {
	const { user } = useUser();

	return (
		<div className="min-h-screen h-max bg-gray-200">
			<AdminProtectedRoute>
				<AdminDashboard userData={user!} />
			</AdminProtectedRoute>
		</div>
	);
};

export default DashboardPage;
