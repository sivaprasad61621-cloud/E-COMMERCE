import express from 'express';
import { login, oauthLogin, register } from '../controllers/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/oauth', oauthLogin);
router.post('/register', register);

export default router;
