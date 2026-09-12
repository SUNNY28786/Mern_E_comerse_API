import express from 'express'

import { login,profile,register, users } from '../Controllers/User.js';
import {Authenticated} from "../Middlewares/auth.js"
const router = express.Router();



// register user
router.post('/register', register)

//LOGIN ROUTER
router.post('/login',login)

//GET ALL USERS
router.get('/all', users)

/// GET USER PROFILE

router.get('/profile', Authenticated, profile)

export default router;