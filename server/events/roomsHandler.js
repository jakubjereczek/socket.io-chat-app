const data = require('../data');

module.exports = (io, socket) => {

    const rooms_create = ({ id, created_by, created_time }) => {
        // ID roomu przejmuję id zalozyciela.
        const room = {
            id,
            created_by,
            created_time
        }
        // todo: sprawdzanie czy istnieje, jesli nie to nie to wysylamy emit, ale w przypadku skorzystania z mongodb by nie powielać
        data.rooms.push(room);
        console.log(data.rooms)
        socket.emit('rooms:create-success');
    }

    const rooms_join = () => {

    }

    const rooms_leave = () => {

    }

    socket.on("rooms:create", rooms_create);
    socket.on("rooms:join", rooms_join);
    socket.on("rooms:leave", rooms_leave);
}

