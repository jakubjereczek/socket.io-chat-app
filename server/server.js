const express = require('express');
const app = express();
const port = process.env.port || 80;

const server = require('http').createServer(app);
const options = {
    cors: {
        origin: 'http://127.0.0.1:3000',
        credentials: true
    }
};

const db = require('./db');

const io = require('socket.io')(server, options);
const bodyParser = require('body-parser')

// middlewares
app.use(bodyParser.json())

// handlers
const registerRoomsHandlers = require('./handlers/roomsHandler');
const registerUsersHandlers = require('./handlers/usersHandler');

const authSocket = require('./middlewares/auth');

const onConnection = (socket) => {
    registerRoomsHandlers(io, socket);
    registerUsersHandlers(io, socket);
    console.log(' %s sockets connected', io.engine.clientsCount);
}

io.use((socket, next) => authSocket(socket, next))
    .on("connection", onConnection);

const UsersRoute = require('./routes/users');

// routes
app.use('/users', UsersRoute)

server.listen(port, "127.0.0.1", () => {
    console.log(`Server is listening at http://127.0.0.1:${port}`)
});