import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const toker = req.cookies.jwt;

        if(!toker){
            res.status(401).json({message: "Sorry! Unauthorized access."});
        }

        const decoded = jwt.verify(toker, process.env.JWT_SECRET);

        if(!decoded){
            res.status(401).json({message: "Sorry! Unauthorized access."});
        }

        const user = await User.findById(decoded.userId).select("-password");

        req.user = user;
        next();
    } 
    catch (error) {
        console.log(error.message)
        //res.status(500).json({message: "Sorry! An Internal error occurred."});
    }
}