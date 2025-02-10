import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config';


export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers['authorization'];
    let decoded;
    if (header) {
        decoded = jwt.verify(header, JWT_SECRET);
        if (decoded) {
            //@ts-ignore
            req.userId = decoded.id
            next();
        } else {
            res.status(401).send('Invalid token');
        }
    } else {
        res.status(401).send('Authorization header missing');
    }
}