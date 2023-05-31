import { Request, Response } from 'express';
import express from 'express';
import Patient, { IPatient } from '../models/patient.model';
import User, { IUser } from '../models/user.model';
import requirePrivilege from '../middleware/requirePrivileges.middleware';
import requireAuth from '../middleware/requireAuth.middleware';
import { MongooseError } from 'mongoose';

const router = express.Router();

router.delete(
	'/patients/:id',
	[requirePrivilege(1), requireAuth()],
	(req: Request, res: Response) => {
		Patient.findOneAndDelete({ _id: req.params.id }, (err: any, doc: IPatient | null) => {
			if (err) {
				console.log(err);
				return res.status(500).send('Server error');
			}
			if (!doc) {
				return res.status(404).send('Patient not found');
			}
			return res.status(200).send('Paciente eliminado correctamente!');
		});
	}
);

router.delete('/users/:id', [requirePrivilege(2), requireAuth()], (req: Request, res: Response) => {
	User.findOneAndDelete({ _id: req.params.id }, (err: MongooseError, doc: IUser | null) => {
		if (err) {
			console.log(err);
			return res.status(500).send('Server error');
		}
		if (!doc) {
			return res.status(404).send('User not found');
		}
		return res.status(200).send('Usuario eliminado correctamente!');
	});
});

router.get('/users', [requirePrivilege(2), requireAuth()], async (req: Request, res: Response) => {
	const users = await User.find();

	if (!users) {
		return res.status(404).send('Users not found');
	}

	res.send(users);
});

router.get('/patients', requirePrivilege(1), async (req: Request, res: Response) => {
	const patients = await Patient.find();

	if (!patients) {
		return res.status(404).send('Patients not found');
	}

	res.send(patients);
});

router.get('/patients/:username', requirePrivilege(1), async (req: Request, res: Response) => {
	const patients = await Patient.findOne({ username: req.params.username });

	if (!patients) {
		return res.status(404).send('Patient not found');
	}

	res.send(patients);
});

export default router;
