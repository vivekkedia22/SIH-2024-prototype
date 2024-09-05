import express from "express";
// import chats from "./data/data.js";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";
import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { Server as SocketIOServer } from "socket.io";
dotenv.config();
const app = express();
app.use(cors());

app.use(express.json()); //tells the server to accept json data from frontend
app.use(express.static("/public")); //makes the public folder static or something basically we dont have to write locaion of pblic file before importing from there

connectDB();
app.get("/", (req, res) => {
  res.send("Api is running");
});
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
// app.listen(3000, console.log(`Server started on PORT ${PORT}`));
const server = app.listen(PORT, console.log(`Server started on PORT ${PORT}`));

const io = new SocketIOServer(server, {
  pingTimeout: 60000, //if user didnt sent any message then its gonna close it to save bandwidth
  cors: {
    origin: "http://localhost:5173",
  },
});
io.on("connection", (socket) => {
  console.log("CONNECTED TO SOCKET.IO");

  socket.on('setup',(userData)=>{
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit('connected')
  });

  socket.on('join chat',(room)=>{
    socket.join(room);
    console.log('User joined room',room);
  })

  socket.on('new message',(newMessageReceived)=>{
    let chat=newMessageReceived.chat;

    if(!chat.users) return console.log('chat.users not defined');

    chat.users.forEach(user=>{
        if(user._id ==newMessageReceived.sender._id) return 
        
        socket.in(user._id).emit('message received socket',newMessageReceived)
        // socket.in(chat._id).emit('message received socket', newMessageReceived);

    })

  })
  
  socket.on('typing',(room)=>socket.in(room).emit("typing"));
  socket.on('stop typing',(room)=>socket.in(room).emit("stop typing"))

  socket.off('setup',()=>{
    console.log("user disconnected");
    socket.leave(userData._id)
  })
});
