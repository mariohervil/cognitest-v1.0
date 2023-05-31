import { Request, Response } from 'express';
import express from 'express';
import WordGame from '../models/game-models/wordGame.model';
import Account from '../models/user.model';
const router = express.Router();

router.post('/game/data', (response: Response, request: Request) => {
	WordGame.create({
		gameName: request.body.gameName,
		rightGuesses: request.body.rightGuesses,
		wrongGuesses: request.body.wrongGuesses,
		omissions: request.body.omissions,
		passedCategories: request.body.passedCategories,
		nonPerseverativeErrors: request.body.nonPerseverativeErrors,
		setContinuationErrors: request.body.setContinuationErrors,
		responseTime: request.body.responseTime,
	});
});

router.get('game/data/config', (request: Request, response: Response) => {
	const user = request?.body?.username;
	// Account.findOne({ user }, );
});
export default router;
