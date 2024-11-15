import express from 'express';
import { subscribeMqtt, getLatestData } from '../controllers/dataController';

const router = express.Router();

// Route to retrieve data and subscribe to MQTT topic
router.post('/subscribe', subscribeMqtt);
router.get('/getData', getLatestData);

export default router;
