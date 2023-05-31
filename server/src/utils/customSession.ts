import { Session } from 'express-session';

export default interface ISession extends Session {
	username?: String;
	role?: Number;
}
