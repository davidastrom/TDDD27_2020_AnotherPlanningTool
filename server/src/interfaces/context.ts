import { DocumentType } from '@typegoose/typegoose';
import { Request, Response } from 'express';
import { User } from '../entities/user';

export interface Context {
	req: Request;
	user: DocumentType<User>;
	res: Response;
}
