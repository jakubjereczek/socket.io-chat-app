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

const onConnection = (socket) => {
    registerRoomsHandlers(io, socket);
    registerUsersHandlers(io, socket);
    console.log(' %s sockets connected', io.engine.clientsCount);

    // W razie wyjścia z chatu, gdy zrobimy to zamykając karte a nie przez exit.
    // Odswieżenie danych + plus przy 0 aktywnych usuniecie kanału.
    socket.on("disconnect", () => {
        // Na początku sprawdzam id, dzięki ktoremu znajdę dane uzytkownika.
        const socketId = socket.id;

        const usersCopy = data.users;

        // nie znajduje
        let findedUser = usersCopy.find(user => user.id === socketId);
        if (findedUser) {
            const roomId = findedUser.room;
            // Wykonuje się gdy użytkownik był w oknie chatu.
            if (roomId) {
                console.log('uzytkownik wyszedl z chatu zamykajac karte');
                socket.leave(roomId);
                findedUser.room = ""
                data.users = usersCopy;

                const roomsCopy = data.rooms;
                let findedRoom = roomsCopy.find(room => room.id === roomId);
                findedRoom.users = findedRoom.users.filter(user => user != socketId);

                if (findedRoom.users.length === 0) {
                    let roomsWithoutThisRoom = roomsCopy.find(room => room !== findedRoom);
                    if (roomsWithoutThisRoom === undefined) {
                        data.rooms = [];
                    } else {
                        data.rooms = [roomsWithoutThisRoom];
                    }
                    console.log('pokoj zostal usuniety poniewaz nikogo w nim nie ma');
                    io.sockets.emit('rooms:refresh-rooms', data.rooms);
                } else {
                    data.rooms = roomsCopy;
                }
                io.to(findedRoom.id).emit('rooms:get-rooms', findedRoom);

                // refresh po wejsciu do pokoju - online
                io.sockets.emit('rooms:refresh-rooms', data.rooms);
            }

        }
        console.log('socket disconnected');
    });
}

io.on("connection", onConnection);



server.listen(port, "127.0.0.1", () => {
    console.log(`Server is listening at http://127.0.0.1:${port}`)
});