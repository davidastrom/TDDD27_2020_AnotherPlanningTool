import { Request, Response } from 'express';

export interface Context {
	req: Request;
	user: Request['user'];
	res: Response;
}
