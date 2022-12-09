import express from "express";
import {Login, Logout, RefreshAccessToken} from "../controllers/Auth.js";

const router = express.Router();

router.post('/refresh', RefreshAccessToken);

router.post('/login', Login);

router.delete('/logout', Logout);

export default router;