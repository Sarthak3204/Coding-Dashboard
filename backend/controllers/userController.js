import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
/*
descr:  Register a new user
route:  POST api/users/ 
access: PUBLIC
*/
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create(req.body);

    if (user) {
        generateToken(res, user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});
/*
descr:  Auth user/ set token
route:  POST api/users/auth
access: PUBLIC
*/
const authUser = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "Auth User" });
});
/*
descr:  Logout a user
route:  POST api/users/logout
access: PUBLIC
*/
const logoutUser = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "logout User" });
});
/*
descr:  Get user profile
route:  GET api/users/profile
access: PRIVATE
*/
const getUserProfile = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "User Profile" });
});
/*
descr:  Update user profile
route:  PUT api/users/profile
access: PRIVATE
*/
const updateUserProfile = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "Update User Profile" });
});

export {
    registerUser,
    authUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
};