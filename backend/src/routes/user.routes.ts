import express from 'express';
import { createUser, getAllUsers } from '../controllers/user.controller';

const router = express.Router();

// Registration endpoint
router.post('/register', createUser);

// Get users endpoint with pagination
router.get('/', getAllUsers);

export default router;
