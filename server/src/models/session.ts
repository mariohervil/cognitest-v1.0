import { model, Schema, Document } from 'mongoose';

interface ISession extends Document {
	sessionToken: String;
}

const sessionSchema = new Schema({
	sessionToken: String,
});

export default model<ISession>('Session', sessionSchema);
