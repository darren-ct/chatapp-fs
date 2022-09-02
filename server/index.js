const express = require("express");
const cors = require("cors");
const http = require("http");
const {Server} = require("socket.io");

const Profile = require("./models/Profile");
const GroupMessage = require("./models/GroupMessage");
const Message = require("./models/Message");

require("dotenv").config();

const app = express();

const sequelize = require("./config/connect");
const verifyJWT = require("./middleware/verifyJWT");
const { resetPassword } = require("./controllers/auth");


sequelize.authenticate().then(()=>{
    console.log("Connected")
});

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors : {
        origin: "http://localhost:3000",
        method: ["GET","POST","PUT","DELETE"]
    }
});

app.use(express.urlencoded());
app.use(express.json());
app.use(express.static("uploads"));

// ROUTES
app.use("/" , require("./routes/auth"));
app.use(verifyJWT);
app.post("/api/v1/auth/resetpassword",resetPassword)
app.use("/api/v1/", require("./routes/api"))

// SOCKET
io.on("connection", (socket)=> {

    // Join dan tentukan room dulu
    socket.on("join_room", data => {
          const rooms = data.room_ids;
          socket.join(rooms)

           // when online
        socket.on("online", async(data)=>{
              await Profile.update({
                  isOnline : "true",
                  last_online : null,
                  socket_id : socket.id
              },{where : {user_id:data.id}});

              rooms.forEach((room)=>{
                  io.in(room).emit("user_online", {id:data.id})
              })
        
        });

          //  when send & unsend message & read message
        socket.on("send_message",(data)=>{
            const room = data.room_id;
    
            io.in(room).emit("message_sent", {
                status : "Message sent"
            })
        });
    
        socket.on("unsend_message",(data)=>{
            const room = data.room_id;
            const id = data.user_id;
    
            io.in(room).emit("message_unsent", {
                status : "Message unsent",
                id
               
            })
        });
    
        socket.on("read_message", async(data)=>{
            const room = data.room_id;
            const id = data.user_id;
            const isGroup = data.isGroup === "true" ? true : false;
    
            if(isGroup){
                await GroupMessage.update({isRead : "true"},{
                    where : {
                        owner_id : id,
                        room_id : room
                    }
                });
            } else {
    
                await Message.update({isRead : "true"},{
                    where : {
                        owner_id : id,
                        room_id : room
                    }
                });
    
            }
    
            io.in(room).emit("message_read", {
                status : "Message read",
                id : id
            });
        });
    
            //  when leave , join , kick 
        socket.on("leave_group",(data)=>{
            const room = data.room_id;
            const id = data.user_id;
    
            io.in(room).emit("group_left", {status : "Group left",id} )
            socket.leave(room);
    
        });
    
        socket.on("join_group",(data)=>{
            const room = data.room_id;
            const id = data.user_id;

            socket.join(room);
    
            io.in(room).emit("group_joined", {status : "Group joined",id} )
        });
    
        socket.on("kick_member", (data)=>{
    
            const room = data.room_id;
            const id = data.user_id;
            const kicker = data.kicker
            
            io.in(room).emit("member_kicked", {status : "Member kicked!",id:id,kicker : kicker})
        })

        // lanjutan habis dikick untuk korban
         socket.on("leave_room",(data)=>{
                const room = data.room_id;
                socket.leave(room)
         })

         // when edit our profile / group profile
         socket.on("edit_group",(data)=>{
            const room = data.room_id;
            const id = data.user_id;
            
            io.in(room).emit("group_edited", {room_id:room,id:id})
        })

          socket.on("edit_profile",(data)=>{
               const id = data.user_id;

               rooms.forEach((room)=>{
                   io.in(room).emit("profile_edited", {id:id})
               })
         })

          // when offline
         socket.on("disconnect", async()=>{
              await Profile.update({
              isOnline : "false",
              last_online : new Date()
             },{where : {socket_id:socket.id}});

             rooms.forEach((room)=>{
                 io.in(room).emit("user_offline", {id:data.id})
               })
            });

    });
    
})

server.listen(5000,()=>{
    console.log("connected to 5000")
});