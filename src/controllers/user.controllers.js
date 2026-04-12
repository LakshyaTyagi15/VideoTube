import { asyncHandler } from '../utils/asyncHandler.js';
import { APIError } from '../utils/APIError.js'
import { User } from '../models/user.model.js'
import { APIResponse } from '../utils/APIResponse.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import jwt from 'jsonwebtoken';

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new APIError(500, "Something went wrong while generating Access and Referesh token");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user detail from frontend
    // validation, like not-empty, correct email
    // check if user already exists: username, email
    // check for image, avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation\
    // return res

    const { fullName, email, userName, password } = req.body;


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
        $or: [{ userName }, { email }]
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

const loginUser = asyncHandler(async (req, res) => {
    // req body se data le aao
    // username or email se login
    // find the user (if not tell him)
    // password and check
    // access and refresh token
    // send cookies
    const { email, userName, password } = req.body;

    if (!(userName || email)) {
        throw new APIError(400, "Email or username is required");
    }

    const user = await User.findOne({
        $or: [{ userName }, { email }]
    });

    if (!user) {
        throw new APIError(404, "User doesn't exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new APIError(401, "Invalid user credintials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);


    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new APIResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )
});

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            },
        },
        {
            new: true,
        }

        
    )
    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new APIResponse(200, {}, "User logged out"));
})


const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
        if (!incomingRefreshToken) {
            throw new APIError(401, "Unauthorized request");
        }
    
        const decodedToken = jwt.verify(incomingRefreshToken, 
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id);
    
        if (!user) {
            throw new APIError(401, "Invalid requesttoken");
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new APIError(401, "Refresh token is exprired or used");
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id);
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new APIResponse(
                200, 
                {
                    accessToken, 
                    refreshToken: newRefreshToken
                },
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new APIError(401, error?.message || "Invalid refresh token");
    }
})

export { registerUser, loginUser, logoutUser, refreshAccessToken };