import { asyncHandler } from '../utils/asyncHandler.js';
import { APIError } from '../utils/APIError.js'
import { User } from '../models/user.model.js'
import { APIResponse } from '../utils/APIResponse.js';

import { uploadOnCloudinary } from '../utils/cloudinary.js'

const registerUser = asyncHandler( async (req, res) => {
    // get user detail from frontend
    // validation, like not-empty, correct email
    // check if user already exists: username, email
    // check for image, avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation\
    // return res

    const {fullName, email, userName, password} = req.body;


    console.log("email: ", email);


    // if (fullName === "") {
    //     throw new APIError(400, "fullName is required");
    // }

    if (
        [fullName, email, userName, password].some((filed) => filed?.trim() === "")
    ) {
        throw new APIError(400, "All fileds are permanent");
    }


    const existedUser = await User.findOne({
        $or : [{userName}, {email}]
    });


    if (existedUser) {
        throw new APIError(409, "User with email or password already exist");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;

    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new APIError(400, "Avatar image is required");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new APIError(400, "Avatar image is required");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase(),
    });

    const createUser = await User.findOne(user._id).select(
        "-password -refreshToken"
    )

    if (!createUser) {
        throw new APIError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new APIResponse(200, createUser, "User registered successfully")
    )
})

export {registerUser};