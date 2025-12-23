import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/User';

export const checkRole = (roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found in session' });
        }

        if (!roles.includes(user.role)) {
            return res.status(403).json({
                message: `Forbidden: This action requires one of the following roles: ${roles.join(', ')}`
            });
        }

        next();
    };
};
