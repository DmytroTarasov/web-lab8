import jwt from 'jsonwebtoken';
import HttpError from '../models/http-error.js';

export default (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
        return next(new HttpError('A token is required for authentication', 403));
    }

    const claims = jwt.verify(token, process.env.JWT_KEY);

    req.userData = { userId: claims.userId };

    next();
}