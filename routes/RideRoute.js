import express from 'express';
import { createRide } from '../Controllers/RideController.js';

const router = express.Router();

// Signup Route
router.post('/new', createRide);

export {router as rideRouter};
