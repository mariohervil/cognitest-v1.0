import { Request, Response } from 'express';
import express from 'express';
import Patient, { IPatient } from '../models/patient.model';
import User, { IUser } from '../models/user.model';
import { encrypt, compareEncryption } from '../utils/encryption';
import { patientOrUser, patientOrUserBySession } from '../utils/differentiate';
import ISession from '../utils/customSession';
import defaultJSON from '../gameConfigDefault.json';
import requirePrivilege from '../middleware/requirePrivileges.middleware';
import requireAuth from '../middleware/requireAuth.middleware';
import { ObjectId } from 'mongoose';
import { randomUUID } from 'crypto';
const router = express.Router();

// Login.
router.post('/login/', async (req: Request, res: Response) => {
	const session = req.session as ISession;
	if (!req?.body?.username || !req?.body?.password) {
		return res.status(400).send({
			message: 'Usuario y contraseña tienen que estar llenos',
			data: req.body,
		});
	}
	console.log(req.body);
	try {
		// @ Patient and Doctor/Admin differentiation based
		const model: (IPatient & { _id: ObjectId }) | (IUser & { _id: ObjectId }) | null =
			await patientOrUser(req);
		// console.log(model);
		if (!model) {
			return res.status(500).send('Usuario o contraseña incorrectos');
		}

		// Comprueba que la contraseña sea correcta, si no lo es, devuelve un error 401
		// Si es correcta, devuelve el usuario y crea una sesión con el nombre de usuario y el rol
		if (compareEncryption(req.body.password, model.password as string)) {
			session.username = model.username;
			session.role = model.role;
			return res.status(200).send(model);
		}
	} catch (error) {
		return res.status(401).send('Usuario o contraseña incorrectos');
	}
	return res.status(401).send('Usuario o contraseña incorrectos');
});

// Register.
router.post('/signup/', [requirePrivilege(1), requireAuth()], (req: Request, res: Response) => {
	const { isPatient, userData } = req.body;

	// Si es paciente, crea un nuevo paciente con los datos recibidos en el body de la petición
	if (isPatient) {
		Patient.create({
			username: userData.username,
			password: encrypt(userData.password),
			firstName: userData.firstName,
			lastName: userData.lastName,
			role: userData.role,
			email: userData.email,
			birthYear: userData.birthYear,
			studies: userData.studies,
			sex: userData.sex,
			gameConfigs: [{ ...defaultJSON, id: randomUUID() }],
		})
			.then((value: IPatient) => {
				console.log(value);
				return res.status(201).send(value);
			})
			.catch((reason: string) => {
				console.log(reason);
				return res.status(500).send(reason);
			});
	}
	// Si no es paciente, el usuario enviado en la petición tiene que ser doctor o admin, y el usuario que hace la petición tiene que ser admin
	else if (!isPatient && userData.role === 1 && (req.session as ISession).role === 2) {
		User.create({
			username: userData.username,
			password: encrypt(userData.password),
			firstName: userData.firstName,
			lastName: userData.lastName,
			role: userData.role,
			gameConfigs: defaultJSON,
		})
			.then((value: IUser) => {
				console.log(value);
				return res.status(201).send(value);
			})
			.catch((reason: string) => {
				console.log(reason);
				return res.status(500).send(reason);
			});
	}
	// Si no es paciente, el usuario enviado en la petición es admin y el usuario que hace la petición es admin, crea un nuevo usuario con los datos recibidos en el body de la petición
	else if (!isPatient && userData.role === 2 && (req.session as ISession).role === 2) {
		User.create({
			username: userData.username,
			password: encrypt(userData.password),
			firstName: userData.firstName,
			lastName: userData.lastName,
			role: userData.role,
		})
			.then((value: IUser) => {
				console.log(value);
				return res.status(201).send(value);
			})
			.catch((reason: string) => {
				console.log(reason);
				return res.status(500).send(reason);
			});
	} else {
		return res.status(403).send('No tienes permiso para hacer eso.');
	}
});

// Logout.
// Destruye la sesión del usuario y devuelve un mensaje de éxito
router.get('/logout', (req: Request, res: Response) => {
	const session: ISession = req.session as ISession;
	if (session.username || session.role) {
		req.session.destroy((error: Error) => {
			if (error) {
				console.log(error);
				return res.status(400).send(`Couldn't log out ${error}`);
			}
		});
		return res.status(200).send('Successfully logged out');
	}
	return res.status(400).send('Already logged out');
});

// Devuelve el usuario que ha iniciado sesión, si no hay ninguno devuelve un error 401
// Esta función se utiliza cada vez que se llama a useUser en el frontend
router.get('/session', (req: Request, res: Response) => {
	const session: ISession = req.session as ISession;
	if (!session?.username && !session.role) {
		return res.status(401).send();
	}
	patientOrUserBySession(req)
		.then((value: IPatient | IUser | null) => {
			if (value) {
				return res.status(200).send({
					username: session.username,
					role: session.role,
					firstName: value.firstName,
					lastName: value.lastName,
				});
			}
		})
		.catch((reason: string) => {
			return res.status(500).send(reason);
		});
});
export default router;
