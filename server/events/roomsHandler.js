const data = require('../data');

module.exports = (io, socket) => {

    // to do usuwanie roomu gdy nikogo w nim nie ma
    // dodaj liczenie przy join i left plus jakos przy disconnect

    const rooms_create = ({ id, userId, name, private, created_by, created_time, users }) => {
        // ID roomu przejmuję id zalozyciela.
        // ID POKOJU JEDNAK TO LOSOWY CIAG ZNAKOW.
        const room = {
            id: "room" + id,
            name,
            private,
            created_by,
            created_time,
            users
        }
        // todo: sprawdzanie czy istnieje, jesli nie to nie to wysylamy emit, ale w przypadku skorzystania z mongodb by nie powielać
        let findedUser = data.users.find(user => user.id === userId);
        console.log('dindedUser', findedUser);
        if (findedUser.room) {
            return;
        }
        data.rooms.push(room);
        socket.emit('rooms:create-success', room);

        // refresh globalny jest w join
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

        // informacja o wejsciu do kanalu
        io.to(findedRoom.id).emit('rooms:get-sent-message', "notification", "has join the room", findedUser.name);

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
            console.log('pokoj zostal usuniety poniewaz nikogo w nim nie ma - wyjscie za pomoca button exit');
        } else {
            data.rooms = roomsCopy;
        }
        console.log('socket leave the room');
        // odswiezam liste online dla reszty uczestnikow chatu
        io.to(findedRoom.id).emit('rooms:get-rooms', findedRoom);

        // informacja o wyjsciu z kanalu
        io.to(findedRoom.id).emit('rooms:get-sent-message', "notification", "has left the room", findedUser.name);

        // refresh po wyjsciu z pokoju - lista rooms
        // wszyscy oprocz socketu - poniewaz on ma odswiezanie w componencie
        socket.broadcast.emit('rooms:refresh-rooms', data.rooms);

    }

    const rooms_refesh_rooms_req = () => {
        // Refresh dla pojedynczego socketu
        socket.emit('rooms:refresh-rooms', data.rooms);
    }

    const rooms_get_rooms_req = (id) => {
        let findedRoom = data.rooms.find(room => room.id === id);
        // odswiezam sobie
        socket.emit('rooms:get-rooms', findedRoom);
        // odsiezam wszystkim obecnym - uaktualnianie listy online - dodac przy wyjsciu jeszcze takie cos
        io.to(findedRoom.id).emit('rooms:get-rooms', findedRoom);

    }

    const rooms_send_message = (type, message, user, roomName) => {
        let findedRoom = data.rooms.find(room => room.id === roomName);
        io.to(findedRoom.id).emit('rooms:get-sent-message', type, message, user);
    }

    socket.on("rooms:create", rooms_create);
    socket.on("rooms:join", rooms_join);
    socket.on("rooms:leave", rooms_leave);
    socket.on("users:refresh-rooms-request", rooms_refesh_rooms_req);
    socket.on("rooms:get-room-request", rooms_get_rooms_req)
    socket.on("rooms:send-message", rooms_send_message)
}

