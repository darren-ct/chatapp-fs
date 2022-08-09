const express = require("express");
const cors = require("cors");
const http = require("http");
const {Server} = require("socket.io");

require("dotenv").config();

const app = express();

const sequelize = require("./config/connect");
const verifyJWT = require("./middleware/verifyJWT");
const verifyAdmin = require("./middleware/verifyAdmin");
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
    console.log(`${socket.id} connected to server`)
})

server.listen(5000,()=>{
    console.log("connected to 5000")
});