import Link from 'next/link';

const Error403 = () => {
	return (
		<>
			<div>
				<div className="flex flex-col items-center justify-center h-screen bg-gray-200">
					<h1 className="text-9xl font-bold">403</h1>
					<h1 className="text-6xl font-medium py-8">Forbidden</h1>
					<p className="text-2xl mb-8 font-medium">
						Ooops! No tienes permiso para acceder a esta página.
					</p>
					<Link
						href={'/games'}
						className="px-4 py-2 bg-primary text-black font-semibold rounded hover:bg-primary-focus"
					>
						Volver
					</Link>
				</div>
			</div>
		</>
	);
};

export default Error403;
