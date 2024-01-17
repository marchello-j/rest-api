import { body } from 'express-validator';
import { inputValidation } from '../middleware/input-model-validation/input-model-validation';
const loginValidation = body('login')
	.isString()
	.trim()
	.isLength({ min: 3, max: 10 })
	.withMessage('Incorrect lenght');

const passwordValidation = body('password')
	.isString()
	.trim()
	.isLength({ min: 6, max: 20 })
	.withMessage('Incorrect lenght must be min 6 max 20 symbol');

const emailValidation = body('email')
	.isString()
	.trim()
	.matches(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/)
	.withMessage('Inncorrect email');

export const userPostValidation = () => [
	loginValidation,
	passwordValidation,
	emailValidation,
	inputValidation,
];
