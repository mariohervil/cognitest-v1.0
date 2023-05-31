import { model, Schema, Document } from 'mongoose';
import { IGameConfig, gameConfigSchema } from './game-models/gameConfig.model';
import defaultJSON from '../gameConfigDefault.json';
// Account model, used by Admins and Doctors.
export interface IUser extends Document {
	// accountId: String;
	username: String;
	password: String;
	firstName: String;
	lastName: String;
	gameConfigs?: IGameConfig;
	role: Number;
}

const User = new Schema(
	{
		// accountId: String,
		username: { type: String, unique: true },
		password: String,
		firstName: String,
		lastName: String,
		role: Number,
		gameConfigs: { type: [gameConfigSchema], default: [], required: false },
	},
	//Shares collection with the "User" model.
	{ timestamps: false, collection: 'users' }
);

export default model<IUser>('User', User);
