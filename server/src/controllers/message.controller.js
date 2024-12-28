import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";  

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUser } }).select("-password");
        res.status(200).json(filteredUsers);
    }
    catch (error) {
        res.status(500).json({ message: "Sorry! An Internal error occurred." });
    }
}

export const getMessages = async (req, res) => {
    try {
        //console.log("Backend Code ",req)
        const loggedInUserId = req.user._id;
        const {id: otherUserId} = req.params;
        //console.log("Both Users fetched")
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: loggedInUserId }
            ]
        });
        res.status(200).json(messages);
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Sorry! An Internal error occurred." });        
    }
}

export const sendMessage = async (req, res) => {
    try{
        const {text, image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const updloadResponse = await cloudinary.uploader.upload(image);
            imageUrl = updloadResponse.url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();
        res.status(201).json(newMessage)
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
        }
    }
    catch(err){
        console.log("Error in sending message", err.message);
        res.status(500).json({message: "Sorry! An Internal error occurred."});
    }
}
