import mongoose , { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        loswercase: true,
        trim: true,
        index: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        rerquired: true,
        lowercase: true,
        unique: true,
        trim: true,
    },
    avatar: {
        type: String, // cloudinary url
        required: true,
    },
    coverImage: {
        type: String,
    },
    watchHistory: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Video",
        },
    ],
    password: { // database should store encripted string
        type: String,
        required: [true, 'Password is required.'],
    },
    refreshToken: {
        type: String,
    },
}, {
    timestamps: true,
});

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) next();
    
    this.password = bcrypt.hash(this.password, 10);
    next();
});  

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password); //return type boolean
}
     
userSchema.methods.generateAccessToken = function() {
    jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function() {
    jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User", userSchema);