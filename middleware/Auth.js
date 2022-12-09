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
    try {
        const role = await Role.findOne({
            where: {
                name: 'admin'
            }
        });

        if (!role) return res.status(404).json({ msg: 'Role \'admin\' does not exist.' });

        const userRoles = await UserRole.findAll({
            where: {
                roleId: role.id,
                userId: req.jwtPayload.id
            }
        });

        if (!userRoles) return res.status(404).json({ msg: 'Could not access user\'s roles.' });

        if (userRoles.length == 0) return res.status(403).json({ msg: 'Unauthorized access. Need admin role.' });

        req.verification = 'admin';
        next();
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const IsModeratorRole = async (req, res, next) => {
    try {
        const role = await Role.findOne({
            where: {
                name: 'moderator'
            }
        });

        if (!role) return res.status(404).json({ msg: 'Role \'moderator\' does not exist.' });

        const userRoles = await UserRole.findAll({
            where: {
                roleId: role.id,
                userId: req.jwtPayload.id
            }
        });

        if (!userRoles) return res.status(404).json({ msg: 'Could not access user\'s roles.' });

        if (userRoles.length == 0) return res.status(403).json({ msg: 'Unauthorized access. Need moderator role.' });

        req.verification = 'moderator';
        next();
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const IsUserRole = async (req, res, next) => {}