const data = require('../data');

module.exports = (io, socket) => {

    const rooms_create = ({ id, userId, name, private, password, created_by, created_time, users }) => {

        const usersCopy = data.users;

        const room = {
            id: "room" + id, // id pokoju to "room"+ generowany losowo ciag 12 znakow
            name,
            private,
            password,
            created_by,
            created_time,
            users,
            messages: []
        }
        console.log("room", room);
        const findedUser = data.getUser(userId, usersCopy);
        if (findedUser && findedUser.room) {
            return;
        }

        data.rooms.push(room);
        socket.emit('rooms:create-success', room);
        // Nie robię tutaj globalnego refresha ponieważ jest w join.
    }

    const rooms_join = (id, userId) => {

        const usersCopy = data.users;
        const roomsCopy = data.rooms;

        const findedUser = data.getUser(userId, usersCopy);
        if (findedUser) {
            findedUser.room = id;
        }
        data.users = usersCopy;

        let findedRoom = data.getRoom(id, roomsCopy);
        if (findedRoom) {
            findedRoom.users.push(
                {
                    id: findedUser.id,
                    name: findedUser.name,
                })
        }
        data.rooms = roomsCopy;
        socket.join(id)
        console.log('socket join to room');

        // informacja o wejsciu do kanalu
        const time = Date.now();
        io.to(findedRoom.id).emit('rooms:get-sent-message', "notification", "has join the room", findedUser.name, findedUser.chatColor, time);
        const newMessage = {
            author: findedUser.name,
            type: "notification",
            message: "has join the room",
            chatColor: findedUser.chatColor,
            time
        }
        findedRoom.messages.push(newMessage);

        // globalny refresh po wejsciu do kanalu
        io.sockets.emit('rooms:refresh-rooms', data.rooms);
    }

    const rooms_leave = (userId) => {

        const usersCopy = data.users;
        const roomsCopy = data.rooms;

        const findedUser = data.getUser(userId, usersCopy);
        let roomId;
        if (findedUser) {
            roomId = findedUser.room;
            findedUser.room = "";
            socket.leave(roomId);
        }
        data.users = usersCopy;

        let findedRoom = data.getRoom(roomId, roomsCopy);
        if (findedRoom) {
            findedRoom.users = findedRoom.users.filter(user => user.id != userId);
            if (findedRoom.users.length === 0) {
                let roomsWithoutThisRoom = roomsCopy.find(room => room !== findedRoom);
                if (roomsWithoutThisRoom === undefined) {
                    data.rooms = [];
                } else {
                    data.rooms = [roomsWithoutThisRoom];
                }
                console.log('pokoj zostal usuniety poniewaz nikogo w nim nie ma - wyjscie za pomoca button exit');
            } else {
                data.rooms = roomsCopy;
            }
        }
        console.log('socket leave the room');
        // odswiezam liste online dla reszty uczestnikow chatu
        io.to(findedRoom.id).emit('rooms:get-rooms', findedRoom);

        // informacja o wyjsciu z kanalu
        const time = Date.now();
        io.to(findedRoom.id).emit('rooms:get-sent-message', "notification", "has left the room", findedUser.name, findedUser.chatColor, time);
        const newMessage = {
            author: findedUser.name,
            type: "notification",
            message: "has left the room",
            chatColor: findedUser.chatColor,
            time
        }
        findedRoom.messages.push(newMessage);

        // refresh po wyjsciu z pokoju - lista rooms
        // wszyscy oprocz socketu - poniewaz on ma odswiezanie w componencie
        socket.broadcast.emit('rooms:refresh-rooms', data.rooms);

    }

    const rooms_refesh_rooms_req = () => socket.emit('rooms:refresh-rooms', data.rooms); // refresh dla pojedynczego socketu


    const rooms_get_rooms_req = (id) => {
        let findedRoom = data.getRoom(id, data.rooms);
        if (findedRoom) {
            socket.emit('rooms:get-rooms', findedRoom); // odswiezenie dla socketu
            io.to(findedRoom.id).emit('rooms:get-rooms', findedRoom); // odswiezenie pozostalym obecynm w pokoju (uaktulnienie listy online)
        }
    }

    const rooms_send_message = (type, message, user, roomName, chatColor, time) => {
        const newMessage = {
            author: user,
            type,
            message,
            chatColor,
            time
        }
        console.log(newMessage);
        let findedRoom = data.getRoom(roomName, data.rooms);
        findedRoom.messages.push(newMessage);
        if (findedRoom) {
            io.to(findedRoom.id).emit('rooms:get-sent-message', type, message, user, chatColor, time);
        }
    }

    // Usunięcie waidomości typing.
    const rooms_delete_message = (type, user, roomName) => {
        let findedRoom = data.getRoom(roomName, data.rooms);

        if (findedRoom) {
            const findedMessage = findedRoom.messages.find(message => message.author === user && message.type === type);

            if (findedMessage) {
                findedRoom.messages = findedRoom.messages.filter(message => message !== findedMessage);

                io.to(findedRoom.id).emit('rooms:get-sent-message', "refresh", null, user, null, null);
                console.log('Wiadomosc zostala usunieta.');
            }
        }

    }

    const rooms_get_sent_message_req = (id) => {
        let findedRoom = data.getRoom(id, data.rooms);
        if (findedRoom) {
            socket.emit('rooms:get-sent-messages-previously', findedRoom.messages);
        }
    }

    socket.on("rooms:create", rooms_create);
    socket.on("rooms:join", rooms_join);
    socket.on("rooms:leave", rooms_leave);
    socket.on("rooms:refresh-rooms-request", rooms_refesh_rooms_req);
    socket.on("rooms:get-room-request", rooms_get_rooms_req)
    socket.on("rooms:send-message", rooms_send_message)
    socket.on("rooms:delete-message", rooms_delete_message)
    socket.on("rooms:get-sent-messages-request", rooms_get_sent_message_req)

}

