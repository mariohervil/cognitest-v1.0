import { Request, Response, NextFunction } from 'express';
import ISession from '../utils/customSession';

// Middleware para comprobar si el usuario está logueado, si no lo está, devuelve un error 401 en la respuesta, si lo está, pasa al siguiente middleware
const requireAuth = () => (request: Request, response: Response, next: NextFunction) => {
	const session: ISession = request.session;
	if (!session.username) {
		return response.status(401).send({ message: "You're not logged in" });
	}
	next();
};

export default requireAuth;
