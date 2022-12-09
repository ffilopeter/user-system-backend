import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {User} from "../models/index.js";
import UserSession from "../models/UserSession.js";

export const Login = async (req, res) => {
    try {
        // Fetch user from database
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        // If no user found
        if (!user) return res.status(404).json({ msg: 'User with such email not found.' });

        // Password check
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) return res.status(401).json({ msg: 'Invalid password.' });

        // If user is suspended
        if (user.suspended === true) return res.status(403).json({ msg: 'User suspended.' });

        const payload = {
            id: user.id,
            uuid: user.uuid,
            email: user.email,
            fistName: user.first_name,
            lastName: user.last_name
        };

        /**
         * Generate new access token
         * 
         * User uses this token to access resources.
         * Token has limited lifetime.
         * User has to get new access token before
         * expiration to stay logged in.
         * User can use his refresh token to obtain
         * new access token.
         */
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15m'
        });

        /**
         * Generate new refresh token
         * 
         * User uses this token to refresh
         * his access token before it expires.
         */
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });

        // Add new refresh token to sessions
        await UserSession.create({
            uuid: user.uuid,
            email: user.email,
            refresh_token: refreshToken
        });

        // Save refresh token to cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        // Save access token to cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 15
        });

        // Send access token back to user as response
        res.status(200).json({ accessToken });
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const Logout = async (req, res) => {
    try {
        // Look for refresh token in cookies
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(204);

        // Destroy current "session" by refresh token
        /*
        await UserSession.destroy({
            where: {
                refresh_token: refreshToken
            }
        });
        */

        // Actually do not destroy session, but mark it as revoked
        // (this could help administrators to get "last activity" of users
        // or for statistics)
        await UserSession.update({
            revoked: true 
        }, {
            where: {
                refresh_token: refreshToken
            }
        });
    
        // Remove tokens from cookies
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        res.sendStatus(200);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }   
}

/**
 * Refresh Access Token
 */
export const RefreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json({ msg: 'Unauthorized.' });

        const session = await UserSession.findOne({
            where: {
                refresh_token: refreshToken
            }
        });

        if (!session) return res.status(401).json({ msg: 'Invalid token.' });

        // const user = await User.findOne({
        //     where: {
        //         uuid: session.uuid
        //     }
        // });

        // This could only happen if logged in user was
        // deleted by administrator (from DB)
        // if (!user) return res.status(404).json({ msg: 'User does not exists.' });

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403);

            // const payload = {
            //     id: user.id,
            //     uuid: user.uuid,
            //     email: user.email,
            //     firstName: user.first_name,
            //     lastName: user.last_name
            // };

            const payload = decoded;

            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '15m'
            });

            // Good idea is to implement heartbeat
            // => update value in UserSession table
            // to set "updatedAt" value and other
            // users can see wheher user is still online
            // or not (last access token update)
            HeartbeatFunction(uuid);

            // == IMPLEMENTED

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                maxAge: 1000 * 60 * 15
            });

            res.status(200).json({ accessToken });
        });
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

/**
 * User's heartbeat implementation
 * (just update something so the updatedAt column updates automatically)
 */
const HeartbeatFunction = async (uuid) => {
    try {
        await UserSession.update({
            uuid: uuid
        }, {
            where: {
                uuid: uuid
            }
        });
    } catch (e) {
        console.log( e.message );
    }
}