
import {Request, Response} from 'express';

export function methodNotAllowed(req: Request, res: Response) {
    res.sendStatus(405);
}