import express, { Request, Response } from 'express';
import GameConfig, { IGameConfig } from '../models/game-models/gameConfig.model';
import User from '../models/user.model';
// import ISession from '../utils/customSession';
import defaultJSON from '../../src/gameConfigDefault.json';
import Patient from '../models/patient.model';
import { randomUUID } from 'crypto';
import ISession from '../utils/customSession';
import requireBody from '../middleware/requireBody.middleware';
import requireAuth from '../middleware/requireAuth.middleware';
import requirePrivilege from '../middleware/requirePrivileges.middleware';
import { patientOrUser } from '../utils/differentiate';
const router = express.Router();

router.post('/save', [requirePrivilege(1)], async (req: Request, res: Response) => {
	const gameConfig: IGameConfig = req.body.gameConfig;
	const newGameConfig = new GameConfig(gameConfig);
	const session = req.session as ISession;
	const { patientId } = req.body;

	const user = await User.findOneAndUpdate(
		{ username: session.username },
		{
			$push: {
				gameConfigs: newGameConfig,
			},
		}
	);
	const patient = await Patient.findOneAndUpdate(
		{ _id: patientId },
		{
			$push: {
				gameConfigs: newGameConfig,
			},
		}
	);
	if (!user) {
		console.log("User doesn't exist");
		return res.status(500).send(`Error when saving Config`);
	}
	if (!patient) {
		console.log("Patient doesn't exist");
		return res.status(500).send(`Error when saving Config`);
	}

	return res.status(201).send({ user, patient });
});

router.get('/reset', async (req: Request, res: Response) => {
	return res.status(200).send({ gameConfig: defaultJSON });
});

router.get('/import', async (req: Request, res: Response) => {
	const username = (req.session as ISession).username;
	try {
		const result = await User.findOne({ username }, { gameConfigs: 1 });

		if (!result) {
			const secondResult = await Patient.findOne({ username }, { gameConfigs: 1 });
			console.log(secondResult);

			if (!secondResult) {
				return res.status(500).send('No user or patient found');
			}
			return res.status(200).send(secondResult?.gameConfigs);
		}
		// console.log(result);
		return res.status(200).send(result?.gameConfigs);
	} catch (error) {
		console.log('Pro: ' + error);
		return res.status(400).send('Error in importation');
	}
});

router.put('/update', async (req: Request, res: Response) => {
	const session: ISession = req.session as ISession;
	const username = session.username;
	for (const field in req.body) {
		if (!req.body[field]) {
			console.log('did not work');
			return res.status(500).send('Your req body is empty');
		}
	}

	const newGameConfig: IGameConfig = req.body.tempConfig;
	const gameConfigId = req.body.gameConfigId;

	try {
		User.findOneAndUpdate(
			{
				username: username,
				'gameConfigs.id': gameConfigId,
			},
			{ $set: { 'gameConfigs.$': newGameConfig } },
			{ new: true },
			(error, account) => {
				if (error) {
					return res.status(500).send(`Failed to update ${error}`);
				}
				Patient.findOneAndUpdate(
					{
						'gameConfigs.id': gameConfigId,
					},
					{ $set: { 'gameConfigs.$': newGameConfig } },
					{ new: true },
					(error, account) => {
						if (error) {
							return res.status(500).send(`Failed to update ${error}`);
						}
						return res.status(200).send('Updated successfully');
					}
				);
			}
		);
	} catch (error) {
		return res.status(400).send(`Error applying configuration ${error}`);
	}
});

router.delete('/delete/:id', requirePrivilege(1), async (req: Request, res: Response) => {
	const username = (req.session as ISession).username;
	const conf: string = req.params.id.toString();

	await User.findOneAndUpdate({ username: username }, { $pull: { gameConfigs: { id: conf } } })
		.then((value) => {
			Patient.findOneAndUpdate(
				{
					'gameConfigs.id': conf,
				},
				{ $pull: { gameConfigs: { id: conf } } },
				{ new: true }
			).then((value) => {
				return res.status(200).send('Config deleted successfully');
			});
		})
		.catch((error) => {
			console.log(error);
			return res.status(500).send(`Error when deleting Config ${error}`);
		});
});

export default router;
