import { model, Schema, Document } from 'mongoose';
import { randomUUID } from 'crypto';

// Este modelo guarda las configuraciones de los juegos
interface IGameConfig {
	id?: String;
	gameName: String;
	configName: String;
	categories: Number;
	maxTries: Number;
	maxScorePerCategory: Number;
	maxTimePerGame: Number;
	maxSecondsPerQuestion: Number;
}

const gameConfigSchema = new Schema(
	{
		id: { type: String, default: randomUUID(), unique: true },
		gameName: String,
		configName: { type: String, required: true },
		categories: Number,
		maxTries: Number,
		maxScorePerCategory: Number,
		maxTimePerGame: Number,
		maxSecondsPerQuestion: Number,
	},
	{ _id: false }
);
export { gameConfigSchema, type IGameConfig };
export default model<IGameConfig>('GameConfig', gameConfigSchema);
