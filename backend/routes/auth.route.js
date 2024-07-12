import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {signup,login,logout, getme} from "../controllers/auth.controller.js"

const router = express.Router();

router.get('/getme',protectRoute,getme);

router.post('/signup',signup);

router.post('/login',login);

router.post('/logout',logout);
 

export default router;