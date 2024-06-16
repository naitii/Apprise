import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

const app = express();
const server = http.createServer(app)
const io = new Server(server, {
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]  
    }
})
export const getReceiverSocket = (receiverId) => {
    console.log("receiver id ", receiverId)
    return userSocketMap[receiverId];
}
const userSocketMap = {};
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User connected", userId);
    if(userId!=="undefined"){
        userSocketMap[userId] = socket.id;
        // console.log("user map ", userSocketMap)
    }

    io.on('disconnect', () => {
        delete userSocketMap[userId];
    })
    
})

export {io, server, app};