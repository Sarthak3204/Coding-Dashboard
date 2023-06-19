import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import { validationResult } from 'express-validator';
/*
descr:  Register a new user
route:  POST api/users/ 
access: PUBLIC
*/
const registerUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create(req.body);

    if (user) {
        generateToken(res, user._id);

        res.status(201).json({//201 Created
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    }
    else {
        res.status(400);//400 Bad Request
        throw new Error('Invalid user data');
    }
});
/*
descr:  Auth user/ set token
route:  POST api/users/auth
access: PUBLIC
*/
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
        console.log(res);
    }
    else {
        res.status(401);//401 Unauthorized
        throw new Error("Invalid email or password");
    }
});
/*
descr:  Logout a user
route:  POST api/users/logout
access: PUBLIC
*/
const logoutUser = (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: "Logged out successfully" });//200 OK
};
/*
descr:  Get user profile
route:  GET api/users/profile
access: PRIVATE
*/
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    }
    else {
        res.status(404);
        throw new Error("User not found");
    }
});
/*
descr:  Update user profile
route:  PUT api/users/profile
access: PRIVATE
*/
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        if (req.body.name !== "") user.name = req.body.name;
        if (req.body.email !== "") user.email = req.body.email;
        if (req.body.password !== "") user.password = req.body.password;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        });
    }
    else {
        res.status(404);
        throw new Error("User not found");
    }
});

export {
    registerUser,
    authUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
};