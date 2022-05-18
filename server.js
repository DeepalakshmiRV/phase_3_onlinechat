const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const mongoose = require('mongoose');

// const io = require("socket.io")(server);
const io = require("socket.io")(server);

const mongoDB = 'mongodb://localhost/mydb';
mongoose.connect(mongoDB).then((res)=>{
    console.log("connected");
    console.log(res)
});

const MsgSchema = new mongoose.Schema({
    sentBy:String,
    msg:String
});

const Message=mongoose.model('Message',MsgSchema)


function saveToBase(from,msg){
    try{
        new Message({sentBy:from,msg:msg}).save()
        console.log("Saved")
    }catch(err){
        console.log(err)
    }
}

app.use(express.static(path.join(__dirname+"/public")));
app.use('/home',express.static(path.join(__dirname+"/public/index.html")))

io.on("connection",function(socket){

    socket.on("newuser",function(username){
        socket.broadcast.emit("update", username  +  "Joined the Conversation");
        console.log("New user")
    });
    socket.on("exituser",function(username){
        socket.broadcast.emit("update", username  +   "left the Conversation");
    });
    socket.on("chat",function(message){
        //const msg = new Msg ({messages : message})
       // msg.save().then(()=>{
           username=message.username
           console.log(username,message)
            socket.broadcast.emit("chat",message);
            saveToBase(username,message.text)
            //io.emit("chat",JSON.parse(message));
        //})
        
    });
});

server.listen(3000);

