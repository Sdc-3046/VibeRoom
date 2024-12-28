import { Server } from 'socket.io'
import http from 'http'
import express from 'express'
import { Socket } from 'dgram'
import { disconnect } from 'process'

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: ["http://localhost:5173"]
})

const userSocketMap = {};

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
  }

io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;

    if( userId ){
        userSocketMap[userId] = socket.id
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", ()=>{
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    });
})

export {io, app, server};