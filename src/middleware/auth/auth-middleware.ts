import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUSES } from '../../uitls/utils';

dotenv.config();

export const authMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// if (req.headers['authorization'] !== 'Basic YWRtaW46cXdlcnR5') {
	// 	res.sendStatus(401);
	// 	return;
	// }
	// next();

	const auth = req.headers['authorization'];

	if (!auth) {
		res.sendStatus(HTTP_STATUSES.UNAUTHORAIZED_401);
		return;
	}

	const [basic, token] = auth.split(' ');

	if (basic !== 'Basic') {
		res.sendStatus(HTTP_STATUSES.UNAUTHORAIZED_401);
		return;
	}

	const decoded = Buffer.from(token, 'base64').toString();

	const [login, password] = decoded.split(':');

	if (
		login !== process.env.AUTH_LOGIN ||
		password !== process.env.AUTH_PASSWORD
	) {
		res.sendStatus(HTTP_STATUSES.UNAUTHORAIZED_401);
		return;
	}

	return next();
};
