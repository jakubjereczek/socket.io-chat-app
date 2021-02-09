const data = require('../data');

module.exports = (io, socket) => {

    // to do usuwanie roomu gdy nikogo w nim nie ma
    // dodaj liczenie przy join i left plus jakos przy disconnect

    const rooms_create = ({ id, name, private, created_by, created_time, users }) => {
        // ID roomu przejmuję id zalozyciela.
        const room = {
            id: "room" + id,
            name,
            private,
            created_by,
            created_time,
            users
        }
        // todo: sprawdzanie czy istnieje, jesli nie to nie to wysylamy emit, ale w przypadku skorzystania z mongodb by nie powielać
        let findedUser = data.users.find(user => user.id === id);
        if (findedUser.room) {
            return;
        }
        data.rooms.push(room);
        socket.emit('rooms:create-success', room);
        // Globalny refresh dla wszystkich po dodaniu 
        io.sockets.emit('rooms:refresh-rooms', data.rooms);
    }

    const rooms_join = (id, userId) => {
        // find user and replace room 
        const usersCopy = data.users;
        let findedUser = usersCopy.find(user => user.id === userId);
        findedUser.room = id;
        data.users = usersCopy;

        const roomsCopy = data.rooms;
        let findedRoom = roomsCopy.find(room => room.id === id);
        findedRoom.users.push(findedUser.id)
        data.rooms = roomsCopy;

        socket.join(id)
        console.log('socket join to room');

        // refresh po wejsciu do pokoju - online
        io.sockets.emit('rooms:refresh-rooms', data.rooms);

    }

    const rooms_leave = (userId) => {

        const usersCopy = data.users;
        let findedUser = usersCopy.find(user => user.id === userId);
        const roomId = findedUser.room;
        findedUser.room = "";
        socket.leave(roomId);
        data.users = usersCopy;

        const roomsCopy = data.rooms;
        let findedRoom = roomsCopy.find(room => room.id === roomId);
        findedRoom.users = findedRoom.users.filter(user => user != userId);

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
        console.log('socket leave the room');
        // odswiezam liste online
        io.to(findedRoom.id).emit('rooms:get-rooms', findedRoom);


        // refresh po wejsciu do pokoju - online
        io.sockets.emit('rooms:refresh-rooms', data.rooms);
    }

    const rooms_refesh_rooms_req = () => {
        // Refresh dla pojedynczego socketu
        socket.emit('rooms:refresh-rooms', data.rooms);
    }

    const rooms_get_rooms_req = (id) => {
        console.log('123123');
        let findedRoom = data.rooms.find(room => room.id === id);
        console.log('findedRoom', findedRoom);
        // odswiezam sobie
        socket.emit('rooms:get-rooms', findedRoom);

        // odsiezam wszystkim obecnym - uaktualnianie listy online - dodac przy wyjsciu jeszcze takie cos
        console.log('ODSWIEZAM DLA INNYCH LDUZI', findedRoom.name);
        io.to(findedRoom.id).emit('rooms:get-rooms', findedRoom);

    }

    const rooms_send_message = (message, user, id) => {
        let findedRoom = data.rooms.find(room => room.id === id);

        io.to(findedRoom.id).emit('rooms:get-sent-message', message, user);
        console.log('message: ' + message + "by user: " + user);
    }

    socket.on("rooms:create", rooms_create);
    socket.on("rooms:join", rooms_join);
    socket.on("rooms:leave", rooms_leave);
    socket.on("users:refresh-rooms-request", rooms_refesh_rooms_req);
    socket.on("rooms:get-room-request", rooms_get_rooms_req)
    socket.on("rooms:send-message", rooms_send_message)
}

