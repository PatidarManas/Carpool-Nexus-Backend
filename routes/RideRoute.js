import express from 'express';
import { createRide, findRides, searchRide } from '../Controllers/RideController.js';

const router = express.Router();

// Signup Route
router.post('/new', createRide);
router.post('/search', findRides);
router.get('/search/:id', searchRide);

export {router as rideRouter};
