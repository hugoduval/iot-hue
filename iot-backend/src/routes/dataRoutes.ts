import express from 'express';
import { getLatestData } from '../controllers/dataController';

const router = express.Router();

router.get('/getData', getLatestData);

export default router;
