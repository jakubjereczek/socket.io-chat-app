const data = require('../data');

module.exports = (io, socket) => {

    const users_create = ({ name, room, chatColor }) => {
        const user = {
            id: socket.id,
            name,
            room,
            chatColor
        }
        // todo: sprawdzanie czy istnieje, jesli nie to nie to wysylamy emit, ale w przypadku skorzystania z mongodb by nie powielać
        data.users.push(user);
        socket.emit('users:create-success', user);
    }

    const user_connext = () => { };
    const user_disconnect = () => { };

    socket.on('users:create', users_create);
}

