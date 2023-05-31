import axios from 'axios';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { IUser } from '../../../../server/src/models/user.model';
import { IPatient } from '../../../../server/src/models/patient.model';
import { toast } from 'react-hot-toast';
const emptyFormData = {
	username: '',
	password: '',
	firstName: '',
	lastName: '',
	birthYear: 0,
	studies: '',
	sex: '',
	role: 0,
};

const SignUpForm = () => {
	const [isPatient, setIsPatient] = useState<boolean>(true);
	const [formData, setFormData] = useState({
		username: '',
		password: '',
		firstName: '',
		lastName: '',
		birthYear: 0,
		studies: '',
		sex: '',
		role: 0,
	});

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		axios
			.post(
				`http://localhost:8080/auth/signup/`,
				{ userData: formData, isPatient: isPatient },
				{ withCredentials: true }
			)
			.then((res) => {
				toast.success('Usuario creado correctamente!');
				//	console.log(res);
			})
			.catch((err) => {
				console.log(err);
				if (err.response.data.code === 11000) {
					toast.error('Error al crear el usuario: El nombre de usuario ya existe');
				} else toast.error('Error al crear el usuario: ' + err.response.data);
				// console.log(err);
			});
	};

	const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
		let value = 0;
		if (!e.target.dataset.title) {
			return;
		}
		if (e.target.dataset.title === 'Doctor') {
			value = 1;
		} else if (e.target.dataset.title === 'Admin') {
			value = 2;
		} else {
			// Handle other cases if needed
		}

		setFormData({
			...formData,
			role: value,
		});
	};
	useEffect(() => {}, [formData.role]);
	const handleCheckBoxChange = (e: ChangeEvent<HTMLInputElement>) => {
		setIsPatient(!isPatient);
		setFormData(emptyFormData);
		e.target.checked = isPatient;
	};

	useEffect(() => {
		console.log(formData.birthYear);
	}, [formData.birthYear]);
	// TODO: Añadir otro formulario para el doctor/admin que cambie con el checkbox y que oculte los campos de paciente

	return (
		<div className={'flex flex-row flex-1 justify-center bg-gray-200'}>
			<form
				onSubmit={handleSubmit}
				className="flex flex-col gap-4 border border-gray-200 rounded-lg shadow-md xl:w-1/2 md:w-full w-full px-20 py-28 my-10 bg-white"
			>
				<div className={'flex flex-row justify-center'}>
					<h1 className={'text-3xl font-bold'}>
						Formulario de {isPatient ? 'Paciente' : 'Admin/Doctor'}
					</h1>
				</div>

				{isPatient && (
					<div className={'flex flex-col gap-5'}>
						<label className="flex flex-col gap-1 form-control">
							Usuario
							<input
								name="username"
								value={formData.username}
								onChange={handleInputChange}
								required
								className="input input-bordered border border-gray-200 p-2 rounded-md focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-100 ring-primary"
							/>
						</label>

						<label className="flex flex-col gap-1 form-control">
							Contraseña
							<input
								type="password"
								name="password"
								value={formData.password}
								onChange={handleInputChange}
								required
								className="input input-bordered border border-gray-200 p-2 rounded-md focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-100 ring-primary"
							/>
						</label>
						<label className="flex flex-col gap-1 form-control">
							Nombre
							<input
								name="firstName"
								value={formData.firstName}
								onChange={handleInputChange}
								required
								className="input input-bordered border border-gray-200 p-2 rounded-md focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-100 ring-primary"
							/>
						</label>

						<label className="flex flex-col gap-1 form-control">
							Apellido
							<input
								name="lastName"
								value={formData.lastName}
								onChange={handleInputChange}
								required
								className="input input-bordered border border-gray-200 p-2 rounded-md focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-100 ring-primary"
							/>
						</label>
						<div className={'animate-flip-down flex flex-col gap-5'}>
							<label className="flex flex-col gap-1 form-control">
								Año de nacimiento
								<input
									type="number"
									name="birthYear"
									value={formData.birthYear}
									onChange={handleInputChange}
									required
									className="border border-gray-200 p-2 rounded-md focus:border-primary focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-100 ring-primary"
								/>
							</label>
							<label className="flex flex-col gap-1 form-control">
								Estudios
								<input
									name="studies"
									value={formData.studies}
									onChange={handleInputChange}
									required
									className="border border-gray-200 p-2 rounded-md focus:border-primary focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-100 ring-primary"
								/>
							</label>
							<label className="flex flex-col gap-1 form-control">
								Sexo
								<input
									name="sex"
									value={formData.sex}
									onChange={handleInputChange}
									required
									className="border border-gray-200 p-2 rounded-md focus:border-primary focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-100 ring-primary"
								/>
							</label>
						</div>
					</div>
				)}

				{!isPatient && (
					<div className={'flex flex-col gap-5'}>
						<label className="flex flex-col gap-1 form-control">
							Usuario
							<input
								name="username"
								value={formData.username}
								onChange={handleInputChange}
								required
								className="input input-bordered border border-gray-200 p-2 rounded-md focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-100 ring-primary"
							/>
						</label>

						<label className="flex flex-col gap-1 form-control">
							Contraseña
							<input
								type="password"
								name="password"
								value={formData.password}
								onChange={handleInputChange}
								required
								className="input input-bordered border border-gray-200 p-2 rounded-md focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-100 ring-primary"
							/>
						</label>
						<label className="flex flex-col gap-1 form-control">
							Nombre
							<input
								name="firstName"
								value={formData.firstName}
								onChange={handleInputChange}
								required
								className="input input-bordered border border-gray-200 p-2 rounded-md focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-100 ring-primary"
							/>
						</label>

						<label className="flex flex-col gap-1 form-control">
							Apellido
							<input
								name="lastName"
								value={formData.lastName}
								onChange={handleInputChange}
								required
								className="input input-bordered border border-gray-200 p-2 rounded-md focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-100 ring-primary"
							/>
						</label>
						<div className={'flex flex-row justify-center'}>
							<div className="btn-group">
								<input
									type="radio"
									name="options"
									data-title="Admin"
									className="btn bg-white text-black hover:bg-primary-focus border-primary hover:border-primary"
									onChange={handleRadioChange}
								/>
								<input
									type="radio"
									name="options"
									data-title="Doctor"
									className="btn bg-white text-black hover:bg-primary-focus border-primary hover:border-primary"
									onChange={handleRadioChange}
								/>
							</div>
						</div>
					</div>
				)}

				<div className="form-control w-52">
					<label className="cursor-pointer label">
						<span className="label-text">Paciente?</span>
						<input
							type="checkbox"
							className="toggle toggle-primary"
							checked={isPatient}
							onChange={handleCheckBoxChange}
						/>
					</label>
				</div>
				<button
					type="submit"
					className="mt-4 bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-indigo focus:ring-2 ring-offset-2 ring-offset-gray-100 ring-primary"
				>
					Dar de alta
				</button>
			</form>
		</div>
	);
};

export default SignUpForm;
