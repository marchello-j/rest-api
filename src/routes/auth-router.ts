import { Request, Response, Router } from 'express';

import { userService } from '../domain/users-service';
import { authLoginValidation } from '../validators/auth-validation';
import { HTTP_STATUSES } from '../uitls/utils';

export const authRouter = Router({});

authRouter.post('/login', authLoginValidation(), async (req: Request, res: Response) => {
	let { loginOrEmail, password } = req.body;
	const checkResult = await userService.checkCredentials(loginOrEmail, password);
	if (!checkResult) {
		res.sendStatus(HTTP_STATUSES.UNAUTHORAIZED_401);
	} else {
		res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
	}
});
