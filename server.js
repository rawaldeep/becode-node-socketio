const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
users=[];
connections= [];
server.listen(process.env.PORT || 5000);

//ROUTE
app.use(express.static('views'))
app.get('/', (req, res)=>{
    res.sendFile(__dirname +'/index.html');
});

    //socket.io
    io.sockets.on('connection', (socket)=>{
        connections.push(socket);
        console.log('connected: %s sockets connected', connections.length);
        /// disconnect
        socket.on('disconnect', (data)=>{ 
            users.splice(users.indexOf(socket.username), 1);
            updateUsernames();
            connections.splice(connections.indexOf(socket), 1);
            console.log('disconnected: %s sockets connected', connections.length);
        });
        //send message
        socket.on('send message', (data)=>{
            io.sockets.emit('new message', {msg: data, user: socket.username});
        })
        //typing
        socket.on('typing', (data)=>{
            sockets.broadcast.emit('typing', {user: socket.username});
        })
        
        //new user
        socket.on('new user', (data, callback)=>{
            callback(true);
            socket.username = data;
            users.push(socket.username);
            updateUsernames();
        });
        const updateUsernames = () =>{
            io.sockets.emit('get users', users);
        }
        });
