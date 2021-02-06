const data = require('../data');

module.exports = (io, socket) => {

    const users_create = (payload) => {
        const user = {
            id: socket.id,
            name: payload
        }
        // todo: sprawdzanie czy istnieje, jesli nie to nie to wysylamy emit, ale w przypadku skorzystania z mongodb by nie powielać
        data.users.push(user);
        socket.emit('users:create-success', user);
    }

    socket.on('users:create', users_create);

}

