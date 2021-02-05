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

const data = require('./data');

io.on('connection', socket => {
    console.log('a user connected');

    socket.on('name', (name) => {

        console.log('wysylam', socket.id, name);
        const user = {
            id: socket.id,
            name
        }
        data.push(user);
        socket.emit('name-success', user);
    });

    //socket.emit('message from server', "message z serwera do klientów");
});


server.listen(port, "127.0.0.1", () => {
    console.log(`Server is listening at http://127.0.0.1:${port}`)
});