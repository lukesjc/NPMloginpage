import express from 'express';
import { loginUser } from '../controllers/auth.controller';

const router = express.Router();

router.post('/', loginUser);  // Explicit path for login

export default router;
