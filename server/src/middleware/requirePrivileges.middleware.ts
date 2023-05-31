import { Request, Response, NextFunction } from 'express';
import ISession from '../utils/customSession';

// Middleware para comprobar si el usuario tiene los privilegios necesarios para realizar la acción, si no los tiene, devuelve un error 403 en la respuesta, si los tiene, pasa al
// siguiente middleware (o al controlador)
const requirePrivilege =
	(requiredPrivilege: Number) => (request: Request, response: Response, next: NextFunction) => {
		const session: ISession = request.session;
		if (session.role && session?.role < requiredPrivilege) {
			return response.status(403).send({ message: 'Forbidden' });
		}
		next();
	};

export default requirePrivilege;
