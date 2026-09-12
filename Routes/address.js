import express from 'express'
import { addAddress, getAddress } from '../Controllers/address.js'
import { Authenticated } from '../Middlewares/auth.js';


const router = express.Router()

//get  address
router.get('/get', Authenticated, getAddress)

//ADD ADDRESS
router.post('/add',Authenticated,addAddress)

export default router;