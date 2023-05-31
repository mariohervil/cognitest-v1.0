import { Request } from 'express';
import Patient from '../models/patient.model';
import User from '../models/user.model';
import ISession from './customSession';

/**
 *
 * @param {Request} req
 * Promise.race returns one of two models depending on which promise is fulfilled first.
 * If there's not a User model with that username but there's an Account model with that username,
 * the Account model will be returned.
 *
 */
const patientOrUser = async (req: Request) => {
	const username = req.body.username!;
	const patient = await Patient.findOne({ username });

	if (patient) {
		return patient;
	}

	const user = await User.findOne({ username });

	if (user) {
		return user;
	}

	return null;
};

const patientOrUserBySession = async (req: Request) => {
	const { username } = req.session as ISession;
	const patient = await Patient.findOne({ username });

	if (patient) {
		return patient;
	}

	const user = await User.findOne({ username });

	if (user) {
		return user;
	}
	return null;
};

export { patientOrUser, patientOrUserBySession };
