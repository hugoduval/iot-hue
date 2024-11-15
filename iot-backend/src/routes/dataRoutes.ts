import express from 'express';
import { getDataAndSubscribe, getLatestData } from '../controllers/dataController';

const router = express.Router();

// Route to retrieve data and subscribe to MQTT topic
router.post('/subscribe', getDataAndSubscribe);
router.get('/getData', getLatestData);

export default router;
