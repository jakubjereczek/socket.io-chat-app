const data = require('../data');

module.exports = (io, socket) => {

    const users_create = ({ name, room, chatColor }) => {
        const user = {
            id: socket.id,
            name: name.trim(),
            room,
            chatColor
        }
        let exist = false;
        data.users.forEach(u => {
            if (u.name === name) {
                console.log(u.name);
                console.log(name);
                exist = true;
                return;
            }
        })
        if (exist) {
            socket.emit('users:create-failed', user);
        } else {
            socket.emit('users:create-success', user);
            data.users.push(user);
        }
    }

    const users_disconnect = () => {
        const socketId = socket.id;
        const usersCopy = data.users;
        const roomsCopy = data.rooms;

        let findedUser = data.getUser(socketId, usersCopy);
        if (findedUser) {
            const roomId = findedUser.room;

            // Usunięcie uzytkownika po rozłączeniu
            data.users = usersCopy.filter(user => user.id != socketId);
            console.log(data.users);

            // Wykonuje się gdy użytkownik był w oknie chatu.
            if (roomId) {
                console.log('uzytkownik wyszedl z chatu zamykajac karte');
                socket.leave(roomId);
                findedUser.room = ""
                data.users = usersCopy;

                let findedRoom = data.getRoom(roomId, roomsCopy);
                findedRoom.users = findedRoom.users.filter(user => user.id != socketId);

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
                const time = Date.now();
                io.to(findedRoom.id).emit('rooms:get-sent-message', "notification", "has  left room (closed browser)", findedUser.name, findedUser.chatColor, time);
                console.log(findedUser);
                const newMessage = {
                    author: findedUser.name,
                    type: "notification",
                    message: "has  left room (closed browser)",
                    chatColor: findedUser.chatColor,
                    time
                }
                findedRoom.messages.push(newMessage);

                // refresh po wyjsciu z pokoju - lista rooms
                io.sockets.emit('rooms:refresh-rooms', data.rooms);
            }

        }
        console.log('socket disconnected');

    };

    socket.on('users:create', users_create);
    socket.on('disconnect', users_disconnect)
}

