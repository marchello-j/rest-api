import { Request } from 'express';

export type RequestWithParams<P> = Request<P, {}, {}, {}>;
export type RequestWithBody<B> = Request<{}, {}, B, {}>;
export type RequestWithBodyAndParams<P, B> = Request<P, {}, B, {}>;
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>;
export type RequestWithQueryAndParams<P, Q> = Request<P, {}, {}, Q>;

export type Params = {
	id: string;
};
export type ErrorType = {
	errorsMessages: ErrorMessageType[];
};
export type ErrorMessageType = {
	field: string;
	message: string;
};
