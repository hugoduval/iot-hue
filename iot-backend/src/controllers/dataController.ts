import { Request, Response } from 'express';
import { db } from '../config';
import mqtt from 'mqtt';

// MQTT broker configuration
const MQTT_BROKER_URL = "http://89.58.12.151";
const MQTT_PORT = 1884;
const MQTT_CLIENT_ID = `iot-backend-${Math.random().toString(16).slice(2)}`;

// Create an MQTT client
const client = mqtt.connect(MQTT_BROKER_URL, {
    port: MQTT_PORT,
    clientId: MQTT_CLIENT_ID
});

// Handle MQTT client events
client.on('connect', () => {
    console.log('Connected to MQTT broker');
});

client.on('error', (err) => {
    console.error('MQTT connection error:', err);
});

client.on('message', (topic, message) => {
    const data = message.toString();
    const splittedData = data.split(' ');
    const light = splittedData[0];
    const temperature = splittedData[1];
    const device_id = splittedData[2];

    // Insert data into the database
    db.query(
        'INSERT INTO iot_data (device_id, temperature, light) VALUES (?, ?)',
        [temperature, light],
        (err) => {
            if (err) {
                console.error('Error inserting data into database:', err);
            }
        }
    );
});

export const subscribeMqtt = (req: Request, res: Response) => {
    const { topic } = req.body;

    // Subscribe to the specified MQTT topic
    client.subscribe(topic, (err) => {
        if (err) {
            console.error('Error subscribing to MQTT topic:', err);
            return res.status(500).json({ error: 'Error subscribing to MQTT topic' });
        }

        console.log(`Subscribed to MQTT topic: ${topic}`);
        res.json({ message: `Subscribed to MQTT topic: ${topic}` });
    });
}

export const getLatestData = (req: Request, res: Response) => {
    // Query the database for the latest data
    db.query(
        'SELECT * FROM iot_data ORDER BY timestamp DESC LIMIT 1',
        (err, results: any[]) => {
            if (err) {
                console.error('Error retrieving data:', err);
                return res.status(500).json({ error: 'Error retrieving data' });
            }

            if (!Array.isArray(results) || results.length === 0) {
                return res.status(404).json({ error: 'Data not found' });
            }

            const data = results[0];
            res.json(data);
        }
    );
}
