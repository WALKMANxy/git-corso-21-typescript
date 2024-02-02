import {Request, Response, NextFunction} from 'express';

export const auth = (req: Request, res: Response, next: NextFunction) => {
    if (req.query.token === '123') {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}