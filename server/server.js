const app = require('./app');
const port = process.env.port || 80;

const server = require('http').createServer(app);
const options = {
    cors: {
        origin: 'http://127.0.0.1:3000',
        credentials: true
    }
};
const io = require('socket.io')(server, options);

// handlers
const registerRoomsHandlers = require('./events/roomsHandler');
const registerUsersHandlers = require('./events/usersHandler');

const onConnection = (socket) => {
    registerRoomsHandlers(io, socket);
    registerUsersHandlers(io, socket);
}

io.on("connection", onConnection);

server.listen(port, "127.0.0.1", () => {
    console.log(`Server is listening at http://127.0.0.1:${port}`)
});