import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import Config from './config';
import session from 'express-session';
import cors from 'cors';
import RegisterDatabaseConnection from './database/connection';
import auth from './routes/auth';
import gameData from './routes/gameData';
import gameRouter from './routes/gameRouter';
import requireAuth from './middleware/requireAuth.middleware';
import userRouter from './routes/users';
// @ Init app
const App = express();

App.use(
	cors({
		origin: ['http://localhost:3000', 'http://localhost'],
		methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE'],
		credentials: true,
	})
);
App.use(express.json());
App.use(express.urlencoded({ extended: true }));
App.use(
	session({
		secret: 'guttmann',
		resave: false,
		saveUninitialized: false,
		name: 'SESSION',
		cookie: { httpOnly: false },
	})
);
App.use('/users', userRouter);
// @ Router
App.use('/auth', auth);
App.use('/gamedata/', gameData);
App.use('/games', gameRouter);

// @ Database connection
RegisterDatabaseConnection(Config);

App.listen(process.env.SERVERPORT, () => {
	console.log(`Listening on ${process.env.SERVERPORT}`);
});
