import { Request, Response } from 'express';
import { db } from '../config';
import mqtt from 'mqtt';

// MQTT broker configuration
const MQTT_BROKER_URL = 'mqtt://your-mqtt-broker-url'; // Replace with your MQTT broker URL
const MQTT_CLIENT_ID = `iot-backend-${Math.random().toString(16).slice(2)}`;

// Create an MQTT client
const client = mqtt.connect(MQTT_BROKER_URL, {
    clientId: MQTT_CLIENT_ID,
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
});

// Handle MQTT client events
client.on('connect', () => {
    console.log('Connected to MQTT broker');
});

client.on('error', (err) => {
    console.error('MQTT connection error:', err);
});

// Controller function to retrieve data and subscribe to MQTT topic
export const getDataAndSubscribe = async (req: Request, res: Response) => {
    const userId = req.body.userId; // Ensure the `userId` is available in the request body or token

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    // Query the database for the device associated with the user
    db.query(
        'SELECT id, device_name FROM iot_device WHERE owner_id = ?',
        [userId],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database query error' });
            }

            if (!Array.isArray(results) || results.length === 0) {
                return res.status(404).json({ error: 'No device associated with the user' });
            }

            const device = results[0] as { id: number; device_name: string };
            const deviceId = device.id;
            const deviceName = device.device_name;

            // MQTT topic based on the device name
            const mqttTopic = `esp32/ESP32-${deviceName}/data`;

            // Subscribe to the MQTT topic
            client.subscribe(mqttTopic, (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to subscribe to MQTT topic' });
                }

                console.log(`Subscribed to MQTT topic: ${mqttTopic}`);

                // Respond to the client that subscription is successful
                res.status(200).json({
                    message: 'Subscribed to MQTT topic',
                    topic: mqttTopic,
                });

                // Listen for messages on the subscribed topic
                client.on('message', (topic, message) => {
                    if (topic === mqttTopic) {
                        var payload = message.toString();
                        var splt = payload.split(' ');
                        const light = parseFloat(splt[0]);
                        const temperature = parseFloat(splt[1]);

                        // Insert the data into the database
                        db.query(
                            'INSERT INTO iot_data (device_id, temperature, light) VALUES (?, ?, ?)',
                            [deviceId, temperature, light],
                            (err) => {
                                if (err) {
                                    console.error('Failed to save data to the database:', err);
                                } else {
                                    console.log('Data saved to database:', payload);
                                }
                            }
                        );
                    }
                });
            });
        }
    );
};

export const getLatestData = async (req: Request, res: Response) => {
    const userId = req.body.userId; // Ensure the `userId` is available in the request body or token

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    // Query the database for the device associated with the user
    db.query(
        'SELECT id, device_name FROM iot_device WHERE owner_id = ?',
        [userId],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database query error' });
            }

            if (!Array.isArray(results) || results.length === 0) {
                return res.status(404).json({ error: 'No device associated with the user' });
            }

            const device = results[0] as { id: number; device_name: string };
            const deviceId = device.id;

            // Query the database for the latest data from the device
            db.query(
                'SELECT temperature, light, created_at FROM iot_data WHERE device_id = ? ORDER BY created_at DESC LIMIT 1',
                [deviceId],
                (err, results) => {
                    if (err) {
                        return res.status(500).json({ error: 'Database query error' });
                    }

                    if (!Array.isArray(results) || results.length === 0) {
                        return res.status(404).json({ error: 'No data available' });
                    }

                    const data = results[0] as { temperature: number; light: number; created_at: string };

                    res.status(200).json({
                        temperature: data.temperature,
                        light: data.light,
                        created_at: data.created_at,
                    });
                }
            );
        }
    );
}
