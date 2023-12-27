import { body } from 'express-validator';
import { inputValidation } from '../middleware/input-model-validation/input-model-validation';
import { PostRepository } from '../repositories/post-repository';
import { BlogRepository } from '../repositories/blog-repository';

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

const blogValidation = body('blogId')
	.isString()
	.trim()
	.custom(async (value) => {
		const blog = await BlogRepository.getBlogById(value);
		if (!blog) {
			throw Error('Incorrect blogId');
		}
		return true;
	})
	.withMessage('Incorrect blogId');

export const postValidation = () => [
	titleValidation,
	shortDescriptionValidation,
	contentValidation,
	blogValidation,
	inputValidation,
];
