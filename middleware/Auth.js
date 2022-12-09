import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {User, Role, UserRole} from "../models/index.js";
import UserSession from "../models/UserSession.js";

dotenv.config();

/**
 * Verify JWT access token upon incoming request
 */
export const VerifyJWT = async (req, res, next) => {
    // const accessToken = req.headers['x-access-token'];
    
    const accessToken = req.cookies.accessToken;
    if (!accessToken) return res.status(403).json({ msg: 'No access token provided.' });

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ msg: 'Unauthorized access.' });

        req.jwtPayload = decoded;
        next();
    });
}

export const IsAdminRole = async (req, res, next) => {
    const userRoles = req.jwtPayload.roles;
    if (!userRoles.includes('admin')) return res.status(403).json({ msg: 'Role \'admin\' required. Access denied.' });
    
    next();
}

export const IsModeratorRole = async (req, res, next) => {
    const userRoles = req.jwtPayload.roles;
    if (!userRoles.includes('moderator')) return res.status(403).json({ msg: 'Role \'moderator\' required. Access denied.' });

    next();
}

export const IsUserRole = async (req, res, next) => {}