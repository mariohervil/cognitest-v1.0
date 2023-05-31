import { model, Schema, Document } from 'mongoose';
import { IGameConfig, gameConfigSchema } from './game-models/gameConfig.model';
import { IWordGame, wordGameSchema } from './game-models/wordGame.model';
// User model, used by patients only.
export interface IPatient extends Document {
	//? username will be an Email.
	username: String;
	password: String;
	firstName: String;
	lastName: String;
	email: String;
	birthYear: Number;
	studies: String;
	sex: String;
	role: Number;
	results: IWordGame[];
	gameConfigs?: IGameConfig[];
	createdAt?: Date;
	updatedAt?: Date;
}

const patientSchema = new Schema(
	{
		//! username will be an Email.
		username: { type: String, unique: true },
		password: String,
		firstName: String,
		lastName: String,
		email: String,
		birthYear: Number,
		studies: String,
		sex: String,
		role: Number,
		results: [wordGameSchema],
		gameConfigs: [{ type: gameConfigSchema, required: false }],
		createdAt: { type: Date, default: Date.now },
		updatedAt: { type: Date, default: Date.now },
	},
	{ collection: 'patients' }
);

export default model<IPatient>('Patient', patientSchema);
