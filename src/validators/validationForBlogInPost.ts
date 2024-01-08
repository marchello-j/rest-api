import { body } from 'express-validator';
import { inputValidation } from '../middleware/input-model-validation/input-model-validation';

const titleValidation = body('title')
	.isString()
	.trim()
	.isLength({ min: 1, max: 30 })
	.withMessage('Incorrect title');

const shortDescriptionValidation = body('shortDescription')
	.isString()
	.trim()
	.isLength({ min: 1, max: 100 })
	.withMessage('Incorrect shortDescription');

const contentValidation = body('content')
	.isString()
	.trim()
	.isLength({ min: 1, max: 1000 })
	.withMessage('Incorrect content');

export const validationForBlogInPost = () => [
	titleValidation,
	shortDescriptionValidation,
	contentValidation,
	inputValidation,
];
