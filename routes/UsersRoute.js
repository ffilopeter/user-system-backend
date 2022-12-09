import express from "express";
import {CreateUser, 
    UpdateUser,
    GetUserInfo,
    ChangePassword,
    VerifyUser,
    ChangeUserRole,
    SuspendUser,
    DeleteUser,
    SetRole,
    HasRole,
    VerifyUserFromLink } from "../controllers/User.js";
import {
    VerifyJWT,
    IsAdminRole,
    IsUserRole,
    IsModeratorRole } from "../middleware/Auth.js";

const router = express.Router();

router.post('/register', CreateUser);

router.get('/verifyUser', VerifyUserFromLink);

router.post('/setrole', [VerifyJWT, IsAdminRole], SetRole);
router.post('/hasrole', [VerifyJWT, IsAdminRole], HasRole);

// Get user information
router.get('/profile', VerifyJWT, GetUserInfo);

// Update profile information
router.post('/profile/update', VerifyJWT, UpdateUser);

// Change password by user himself
router.post('/profile/changepassword', VerifyJWT, ChangePassword);

// Verify user from email
router.get('/verify/:uuid/:verificationCode', VerifyUser);

/**
 * ADMIN ACTIONS
 */

// GetUserInfo will check if request come from admin or user and 
// return values based on role
// router.get('/user/:uuid', [VerifyJWT, IsAdminRole], GetUserInfo);

router.post('/user/update/:uuid', [VerifyJWT, IsModeratorRole], UpdateUser);
router.post('/user/verify/:uuid', [VerifyJWT, IsAdminRole], VerifyUser);
router.post('/user/role/:uuid', [VerifyJWT, IsAdminRole], ChangeUserRole);
router.post('/user/suspend/:uuid', [VerifyJWT, IsAdminRole], SuspendUser);
router.post('/user/delete/:uuid', [VerifyJWT, IsAdminRole], DeleteUser);

export default router;