import { Response } from 'express';
import { db } from '../config';

// Adjust associateDevice to accept userId directly
export const associateDevice = (device_name: string, owner_id: number, res: Response) => {
    db.query(
        'INSERT INTO iot_device (device_mac, device_name, owner_id) VALUES (?, ?, ?)',
        [0, device_name, owner_id],
        (err, result) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.status(201).json({ message: 'Device associated successfully' });
        }
    );
};
