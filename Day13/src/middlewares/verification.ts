import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { User, UserDocument } from '../models/User';

// Extend the Request interface to include the 'user' property
interface AuthenticatedRequest extends Request {
  user?: UserDocument;
}

export const verify = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const secretKey = process.env.JWT_SECRET_KEY as Secret || 'default-secret';
    const decoded = jwt.verify(token, secretKey) as { userId: string; email: string };

    // Fetch user from the database
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).send('Unauthorized');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send('Unauthorized');
  }
};
