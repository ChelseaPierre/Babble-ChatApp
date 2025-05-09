import { Server } from "socket.io";
import http from "http";
import express from "express";


const app = express ();

const server = http.createServer(app)
const io = new Server (server, {
    cors:{
        origin: ["http://localhost:3000"],
        methods: ["GET","POST"],
    },
})

export const getReceiverSocketId = (receiverId) => {
     return userSocketMap[receiverId];
}

const userSocketMap = {}; //userID:socketID

io.on("connection",(socket) => {
    console.log("user", socket.id, "connected")

    const userId = socket.handshake.query.userId;
    if(userId != "undefined") userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap)) //used to send events to all the connected clients

// socket.on() used to listen to the events, can be used on both client and server side
    socket.on("disconnect",()=>{
        console.log("user", socket.id, "disconnected");
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

export {app, io, server}