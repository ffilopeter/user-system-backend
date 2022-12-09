import bcrypt from "bcrypt";
import {User, Role, UserRole} from "../models/index.js";

/**
 * ADD:
 * - check if user with such email does not exist
 * - 
 */
export const CreateUser = async (req, res) => {
    try {
        const {email, password, confirm_password, first_name, last_name} = req.body;
        // Check if passwords match
        if (password !== confirm_password) return res.status(400).json({ msg: 'Passwords do not match.' });

        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        /**
         * Create new user or find one if already exists
         */
        const newUser = await User.findOrCreate({
            where: {
                email: email
            },
    
            defaults: {
                email: email,
                password: hashPassword,
                first_name: first_name,
                last_name: last_name,
                verification_code: verificationCode
            }
        });

        /**
         * User found (not created)
         * (user already exists)
         */
        const exists = !newUser[1];
        if (exists) return res.status(400).json({ msg: 'Such user already exists.' });

        /**
         * To check if such role exists
         * but primarily to assign this role to user
         */
        const userRole = await Role.findOne({
            where: {
                name: 'user'
            }
        });

        /**
         * If such user role does not exists
         */
        if (!userRole) return res.status(400).json({ msg: 'Such role does not exist.' });

        /**
         * findOrCreate method returns an array
         * first item is found/created record
         * second item is boolean (true=created, false=found)
         * 
         * therefore newUser[0] which references to a new object
         */
        await newUser[0].addRole(userRole, { through: UserRole });

        res.status(201).json({ msg: 'User created successfuly.' });
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

/**
 * Check if user has role
 */
export const HasRole = async (req, res) => {
    try {
        // These will be updated due to changes in frontend
        const {uuid, roleid} = req.body;

        const user = await User.findOne({
            where: {
                uuid: uuid
            }
        });

        if (!user) return res.status(400).json({ msg: 'Such user does not exist.' });

        const userRoles = await UserRole.findAll({
            where: {
                roleId: roleid,
                userId: user.id
            }
        });

        if (userRoles.length > 0) return res.status(200).json({ msg: 'User has role.' });
        
        res.status(200).json({ msg: 'User does not have such role.'});
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

/**
 * Set role to user
 */
export const SetRole = async (req, res) => {
    try {
        // These will be updated due to changes in frontend
        const {uuid, roleid} = req.body;

        const user = await User.findOne({
            where: {
                uuid: uuid
            }
        });

        if (!user) return res.status(400).json({ msg: 'Such user does not exist.' });

        const role = await Role.findOne({
            where: {
                id: roleid
            }
        });

        if (!role) return res.status(400).json({ msg: 'Such role does not exist.' });

        await user.addRole(role, { through: UserRole });
        res.status(200).json({ msg: 'Role added to user.' });
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

/**
 * 
 */
export const UpdateUser = async (req, res) => {
    res.status(200).json({ msg: 'We are in' });
}

export const GetUserInfo = async (req, res) => {}

export const ChangePassword = async (req, res) => {}

export const VerifyUser = async (req, res) => {}

export const ChangeUserRole = async (req, res) => {}

export const SuspendUser = async (req, res) => {}

export const DeleteUser = async (req, res) => {}