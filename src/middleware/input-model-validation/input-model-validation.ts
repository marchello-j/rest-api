import { ValidationError, validationResult } from 'express-validator';

import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUSES } from '../../uitls/utils';

export const inputValidation = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const formattedError = validationResult(req).formatWith(
		(error: ValidationError) => {
			switch (error.type) {
				case 'field':
					return {
						message: error.msg,
						field: error.path,
					};
				default:
					return {
						message: error.msg,
						field: 'Unknown',
					};
			}
		}
	);

	if (!formattedError.isEmpty()) {
		const errorMessage = formattedError.array({ onlyFirstError: true });
		const errors = {
			errorsMessages: errorMessage,
		};
		res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors);
		return;
	}
	return next();
};
