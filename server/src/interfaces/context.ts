import { Request, Response } from 'express';
import { TokenUser } from './token-user';

export interface Context {
	req: Request;
	user: TokenUser;
	res: Response;
}
