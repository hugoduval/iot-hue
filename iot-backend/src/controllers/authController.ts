import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, JWT_SECRET } from '../config';

export const register = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            'INSERT INTO user (username, password) VALUES (?, ?)',
            [username, hashedPassword],
            (err, result) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                res.status(201).json({ message: 'User registered successfully' });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    db.query(
        'SELECT * FROM user WHERE username = ?',
        [username],
        async (err, results: any[]) => {
            if (err || !Array.isArray(results) || results.length === 0)
                return res.status(401).json({ error: 'Invalid username or password' });

            const user = results[0];
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ message: 'Login successful', token });
        }
    );
};
