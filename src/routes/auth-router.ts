import { Request, Response, Router } from 'express';

import { userService } from '../domain/users-service';
import { authLoginValidation } from '../validators/auth-validation';

export const authRouter = Router({});

authRouter.post('/login', authLoginValidation(), async (req: Request, res: Response) => {
	let { loginOrEmail, password } = req.body;
	const checkResult = await userService.checkCredentials(loginOrEmail, password);
	if (!checkResult) {
		res.sendStatus(401);
	} else {
		res.sendStatus(204);
	}
});
