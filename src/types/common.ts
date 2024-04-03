import { Request } from 'express'

export type RequestWithParams<P> = Request<P, {}, {}, {}>
export type RequestWithBody<B> = Request<{}, {}, B, {}>
export type RequestWithBodyAndParams<P, B> = Request<P, {}, B, {}>
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>
export type RequestWithQueryAndParams<P, Q> = Request<P, {}, {}, Q>

export type Params = {
	id: string
}
export type ErrorType = {
	errorsMessages: ErrorMessageType[]
}
export type ErrorMessageType = {
	field: string
	message: string
}

export type Result<T = false> = {
	code: ResultCode
	errorMessage?: string
	data: T
}

export enum ResultCode {
	Success = 'Success',
	NotFound = 'NotFound',
	Forbidden = 'Forbidden'
}
