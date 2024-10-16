import express from 'express';
import { placeSuggestions } from '../Controllers/MapRoutes.js';

const router = express.Router();

// Signup Route
router.get('/suggestions/:location',placeSuggestions );


export {router as MapRouter};
