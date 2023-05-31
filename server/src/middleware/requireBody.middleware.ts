import { Request, Response, NextFunction } from 'express';

// Middleware para comprobar si el body de la petición está completo, si no lo está, devuelve un error 500 en la respuesta, si lo está, pasa al siguiente middleware
const requireBody = (req: Request, res: Response, next: NextFunction) => {
	for (const field in req.body) {
		if (!req.body[field]) {
			return res.status(500).send('No todos los campos están completos');
		}
	}
	next();
};

export default requireBody;
