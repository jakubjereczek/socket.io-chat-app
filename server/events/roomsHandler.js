const data = require('../data');

module.exports = (io, socket) => {

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
        data.rooms.push(room);
        socket.emit('rooms:create-success', room);
        // Globalny refresh dla wszystkich po dodaniu 
        io.sockets.emit('rooms:refresh-rooms', data.rooms);
    }

    const rooms_join = () => {

    }

    const rooms_leave = () => {

    }

    const rooms_refesh_rooms_req = () => {
        // Refresh dla pojedynczego socketu
        socket.emit('rooms:refresh-rooms', data.rooms);
    }

    socket.on("rooms:create", rooms_create);
    socket.on("rooms:join", rooms_join);
    socket.on("rooms:leave", rooms_leave);
    socket.on("users:refresh-rooms-request", rooms_refesh_rooms_req);
}

