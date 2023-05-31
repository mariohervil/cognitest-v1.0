import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/SessionContext';
export default function App({ Component, pageProps }: AppProps) {
	return (
		<AuthProvider>
			<Layout>
				<Component {...pageProps} />
				<Toaster position="bottom-center" />
			</Layout>
		</AuthProvider>
	);
}
