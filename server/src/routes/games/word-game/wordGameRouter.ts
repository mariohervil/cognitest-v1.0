import express, { Response, Request } from 'express';
import gameConfigRouter from '../../gameConfig';
import Patient from '../../../models/patient.model';
import { IWordGame, wordGameSchema } from '../../../models/game-models/wordGame.model';
import ISession from '../../../utils/customSession';
import requireAuth from '../../../middleware/requireAuth.middleware';

const router = express.Router();

router.use('/config', gameConfigRouter);

router.post('/results', requireAuth(), (req: Request, res: Response) => {
	const { username } = req.session as ISession;
	console.log(req);
	/*
	
	
	const gameResults = req.body.gameResults as IWordGame;
	const gameName = gameResults.gameName;
	const rightGuesses = Number(gameResults.rightGuesses);
	const wrongGuesses = Number(gameResults.wrongGuesses);
	const omissions = Number(gameResults.omissions);
	const passedCategories = Number(gameResults.passedCategories);
	const perseverativeErrors = Number(gameResults.perseverativeErrors);
	const nonPerseverativeErrors = Number(gameResults.nonPerseverativeErrors);
	const setContinuationErrors = Number(gameResults.setContinuationErrors);
	const responseTime = (gameResults.responseTime as unknown as string)
		.split(',')
		.map((time) => Number(time));


	
	*/

	const wordGameResults = req.body.gameResults as IWordGame;
	/*


	const wordGameResults: IWordGame = {
		gameName,
		rightGuesses,
		wrongGuesses,
		omissions,
		passedCategories,
		perseverativeErrors,
		nonPerseverativeErrors,
		setContinuationErrors,
		responseTime,
	};


*/
	Patient.findOneAndUpdate({ username }, { $push: { results: wordGameResults } }, { new: true })
		.then((value) => {
			console.log(value);
			return res.status(201).send(value);
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).send(err);
		});
});

export default router;
