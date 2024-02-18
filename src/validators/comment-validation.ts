import {body} from 'express-validator';
import {inputValidation} from '../middleware/input-model-validation/input-model-validation';

const contentValidation = body('content')
	.isString()
	.trim()
	.isLength({ min: 20, max: 300 })
	.withMessage('Incorrect Comment');
export const commentValidation = () => [
	contentValidation,
	inputValidation,
];
