const express = require('express');
const app = express();
const PORT = process.env.PORT || 80;

const server = require('http').createServer(app);
const options = {
    cors: {
        origin: 'https://socketio-chat-app-client.herokuapp.com:*',
        credentials: true
    }
};

const io = require('socket.io')(server, options);
const bodyParser = require('body-parser')

// middlewares
app.use(bodyParser.json())

// handlers
const registerRoomsHandlers = require('./handlers/roomsHandler');
const registerUsersHandlers = require('./handlers/usersHandler');

const onConnection = (socket) => {
    registerRoomsHandlers(io, socket);
    registerUsersHandlers(io, socket);
    console.log(' %s sockets connected', io.engine.clientsCount);
}

io.on("connection", onConnection);

server.listen(PORT, err => {
    if (err) throw err;
    console.log(`Server is listening at ${PORT}`)
});