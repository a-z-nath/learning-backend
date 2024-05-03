import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiErrorHandler } from '../utils/ApiErrorHandler.js'
import { ApiResponseHandler } from '../utils/ApiResponseHandler.js'
import { User } from '../models/users.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const registerUser = asyncHandler (async (req, res) => {
    /**
     * get user details from frontend
     * validate user details is null or not
     * check if user already exists
     * check for images, validate avatar
     * upload them cloudinary
     * create user object & entry it to db
     * remove password and refreshToken from response
     * check for user creation
     * return res
     */

    // user details
    const { fullName, userName, email, password } = req.body;
    // console.log(email);
    
    // validation of null
    if (
        [fullName, email, userName, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // check user already exists
    const isExist = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if(isExist) {
        throw new ApiErrorHandler(400, "User with userName or email already exists.")
    }

    // check for images
    // console.log(req.files); // all types of file can be found here uploaded

    const avatarLocalPath = req.files?.avatar[0]?.path

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    //validate avatar
    if(!avatarLocalPath) {
        throw new ApiErrorHandler(400, "Avatar is required.")
    }

    //upload them cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) {
        throw new ApiErrorHandler(400, "Something went wrong while uploading avatar.")
    }

    // create user object & entry it to db
    const user = await User.create({
        fullName,
        userName: userName.toLowerCase(),
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })

    //remove password and refreshToken from response
    //check for user creation
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    
    //check for user creation
    if(!createdUser) {
        throw new ApiErrorHandler(500, "Something went wrong while registering the user.")
    }
    console.log("User created successfully.");
    res.status(201).json(
        new ApiResponseHandler(200,createdUser, "User registered successfully.")
    )

})

export {
    registerUser,
}