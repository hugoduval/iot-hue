import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { associateDevice } from '../controllers/deviceController';
import { JWT_SECRET } from '../config';

const router = express.Router();

// Authentication Middleware
const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'Unauthorized: No token provided' });
        return;
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(403).json({ error: 'Forbidden: Invalid token' });
            return;
        }

        // If verification is successful, store user ID locally
        const userId = (decoded as { id: number }).id;
        (req as any).userId = userId; // Optionally add it to req for future functions
        req.body.userId = userId; // Add userId to req.body to pass to the next handler

        next();
    });
};

// Adjusted Route to associate a device with a user
router.post('/associate', authenticate, (req: Request, res: Response) => {
    const { device_mac, device_name, userId } = req.body;

    // Call associateDevice with the extracted userId
    associateDevice(device_name, userId, res);
});

export default router;
