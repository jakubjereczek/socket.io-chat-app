const app = require('./app');
const port = process.env.port || 80;
const data = require('./data');

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
const registerDisconnect = require('./events/disconnect');

const onConnection = (socket) => {
    registerRoomsHandlers(io, socket);
    registerUsersHandlers(io, socket);
    console.log(' %s sockets connected', io.engine.clientsCount);

    // user disconnect closing card in browser
    registerDisconnect(io, socket);
}

io.on("connection", onConnection);

server.listen(port, "127.0.0.1", () => {
    console.log(`Server is listening at http://127.0.0.1:${port}`)
});