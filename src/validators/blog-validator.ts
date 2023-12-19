import { body } from 'express-validator';
import { inputValidation } from '../middleware/input-model-validation/input-model-validation';
export const nameValidation = body('name')
	.isString()
	.trim()
	.isLength({ min: 1, max: 15 })
	.withMessage('Incorrect lenght');

export const descriptionValidation = body('description')
	.isString()
	.trim()
	.isLength({ min: 1, max: 500 })
	.withMessage('Incorrect lenght must be min 1 max 500 symbol');

export const websiteUrlValidation = body('websiteUrl')
	.isString()
	.trim()
	.isLength({ min: 1, max: 100 })
	.withMessage('Incorrect lenght must be min 1 max 100 symbol')
	.matches('[a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
	.withMessage('Inncorrect website url');

export const blogValidation = () => [
	nameValidation,
	descriptionValidation,
	websiteUrlValidation,
	inputValidation,
];
