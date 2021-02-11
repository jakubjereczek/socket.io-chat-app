const data = require('../data');

module.exports = (io, socket) => {

    // W przypadku gdy user wyjdzie zamykając przeglądarkę, a będzie w pokoju.
    const user_disconnect = () => {
        const socketId = socket.id;
        const usersCopy = data.users;
        const roomsCopy = data.rooms;

        let findedUser = data.getUser(socketId, usersCopy);
        if (findedUser) {
            const roomId = findedUser.room;
            // Wykonuje się gdy użytkownik był w oknie chatu.
            if (roomId) {
                console.log('uzytkownik wyszedl z chatu zamykajac karte');
                socket.leave(roomId);
                findedUser.room = ""
                data.users = usersCopy;

                let findedRoom = data.getRoom(roomId, roomsCopy);
                findedRoom.users = findedRoom.users.filter(user => user != socketId);

                // usuwamy pokoj poniewaz jest pusty
                if (findedRoom.users.length === 0) {
                    let roomsWithoutThisRoom = roomsCopy.find(room => room !== findedRoom);

                    if (roomsWithoutThisRoom === undefined) {
                        data.rooms = [];
                    } else {
                        data.rooms = [roomsWithoutThisRoom];
                    }
                    console.log('pokoj zostal usuniety poniewaz nikogo w nim nie ma - wyjscie z karty');
                } else {
                    data.rooms = roomsCopy;
                }

                io.to(findedRoom.id).emit('rooms:get-rooms', findedRoom);

                // informacja o wyjsciu z kanalu
                io.to(findedRoom.id).emit('rooms:get-sent-message', "notification", "has join left room (closed browser)", findedUser.name);

                // refresh po wyjsciu z pokoju - lista rooms
                io.sockets.emit('rooms:refresh-rooms', data.rooms);
            }

        }
        console.log('socket disconnected');
    }

    socket.on('disconnect', user_disconnect);

}

