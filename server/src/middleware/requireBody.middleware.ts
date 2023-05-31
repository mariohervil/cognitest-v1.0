import { Request, Response, NextFunction } from 'express';

const requireBody = (req: Request, res: Response, next: NextFunction) => {
	for (const field in req.body) {
		if (!req.body[field]) {
			return res.status(500).send('No todos los campos están completos');
		}
	}
	next();
};

export default requireBody;
