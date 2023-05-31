import { model, Schema, Document } from 'mongoose';
export interface IGameConfigImport extends Document{
    username:String;
    nameConf:String;
    categories: Number;
    maxTries: Number;
    maxScorePerCategory: Number;
    wordsPerRound: Number;
    maxTimePerGame: Number;
    maxSecondsPerQuestion: Number;
}
const gameConfigImportSchema = new Schema({
    username:String,
    nameConf:String,
    categories: Number,
    maxTries: Number,
    maxScorePerCategory: Number,
    wordsPerRound: Number,
    maxTimePerGame: Number,
    maxSecondsPerQuestion: Number,
});
export default model<IGameConfigImport>('GameConfigImport', gameConfigImportSchema);