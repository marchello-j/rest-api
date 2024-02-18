import { body } from 'express-validator'
import { inputValidation } from '../middleware/input-model-validation/input-model-validation'

const loginOrEmailValidation = body('loginOrEmail')
  .isString()
  .trim()
  .notEmpty()
  .withMessage('Invalid login or email')

const passwordValidation = body('password')
  .isString()
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage('Invalid password')
export const authLoginValidation = () => [
  loginOrEmailValidation,
  passwordValidation,
  inputValidation
]
