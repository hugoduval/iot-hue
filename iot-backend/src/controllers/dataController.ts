import { Request, Response, NextFunction } from 'express';
import { db } from '../config';
import { RowDataPacket } from 'mysql2';

export const getLatestData = (req: Request, res: Response, next: NextFunction): void => {
  // Extract deviceId from the query parameters
  const { device_name } = req.query;

  // Validate deviceId
  if (!device_name || typeof device_name !== 'string') {
    res.status(400).send({ error: 'Invalid or missing device_name' });
    return;
  }

  // SQL query to get the latest data by deviceId
  const query = `
    SELECT * FROM data
    WHERE device_name = ?
    ORDER BY timestamp DESC
    LIMIT 1;
  `;

  // Execute the query
  db.query(query, [device_name], (error: any, results: RowDataPacket[]) => {
    if (error) {
      // Log the error for debugging purposes
      console.error('Error getting data:', error);
      res.status(500).send({ error: 'Internal server error' });
      return;
    }

    // Typecast results to an array of RowDataPacket
    const rows = results as RowDataPacket[];

    if (rows.length === 0) {
      // Handle case where no data is found for the given deviceId
      res.status(404).send({ message: 'No data found for the given deviceId' });
      return;
    }

    // Send the latest data in the response
    res.status(200).send(rows[0]);
  });
};
