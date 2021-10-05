import { Request, Response } from 'express';
import { User } from '../entities/user';

export interface Context {
	req: Request;
	user: User;
	res: Response;
}
