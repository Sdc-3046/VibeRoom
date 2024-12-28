import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  try{
    const { email, fullname, password } = req.body;
    if(!email || !fullname || !password){
        res.status(400).json({message: "Please enter all the fields."});
    }
    //console.log("Checking if all fields are entered", fullname, email, password);
    if(String(password).length < 8){
        res.status(400).json({message: "Sorry! Password must be at least 8 characters long."});
    }

    const user = await User.findOne({ email});

    if(user){
        res.status(400).json({message: "Sorry! User already exists."});
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password,salt);
    //console.log("Creating New User");
    const newUser = new User({
        email,
        fullname,
        password: hashedPassword
    });
    //console.log("New User Created", newUser);
    if(newUser){
        generateToken(newUser._id,res);
        await newUser.save();
        res.status(201).json({newUser},);
    }
    else{
        res.status(400).json({message: "Sorry! User could not be created."},
            {user:{
                email: newUser.email,
                fullname: newUser.fullname,
                profilePic: newUser.profilePic,
            }}
        );
    }
  }
  catch(err){
    console.log("Error in signup controller", err.message);
    res.status(500).json({message: "Sorry! An Internal error occurred."});
  }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try{
        if(!email || !password){
            res.status(400).json({message: "Sorry! Please enter all the fields."});
        }
        const user = await User.findOne({ email });
        if(!user){
            res.status(400).json({message: "Sorry! Invalid credentials."});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            res.status(400).json({message: "Sorry! Invalid credentials."});
        }
        generateToken(user._id,res);
        res.status(200).json(user);
    }
    catch(err){
        console.log("Error in login", err.message);
        //return res.status(500).json({message: "Sorry! An Internal error occurred."});
    }
}

export const logout = (req, res) => {
    try{
        res.clearCookie("jwt");
        res.status(200).json({message: "User logged out successfully!"});
    }
    catch(err){
        console.log("Error in logout", err.message);
        res.status(500).json({message: "Sorry! An Internal error occurred."});
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullname, profilePic } = req.body;
        const userId = req.user._id;
        if (fullname != undefined || fullname != null) {
            req.user.fullname = fullname;
        }
        if (profilePic != undefined || profilePic != null) {
            const updloadResponse = await cloudinary.uploader.upload(profilePic);
            const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: updloadResponse.secure_url }, { new: true });
            res.status(200).json(updatedUser);
        }
    } catch (error) {
        console.log("Error in updateProfile", error.message);
        res.status(500).json({message: "Sorry! An Internal error occurred."});        
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth", err.message);
        res.status(500).json({message: "Sorry! An Internal error occurred."});
    }
}