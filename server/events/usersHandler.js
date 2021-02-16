const e = require('express');
const data = require('../data');

module.exports = (io, socket) => {

    const users_create = ({ name, room, chatColor }) => {
        const user = {
            id: socket.id,
            name: name.trim(),
            room,
            chatColor
        }
        // todo: sprawdzanie czy istnieje, jesli nie to nie to wysylamy emit, ale w przypadku skorzystania z mongodb by nie powielać
        // sprawdzenie czy user o tym nicku istnieje
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

    // Funkcja odwoluje sie do rozłaczenia się uzytkownika.
    const users_disconnect = () => {
        // Usunięcie z tablicy oblektu uzytkownika.
        const socketId = socket.id;
        let usersCopy = data.users;

        let findedUser = data.getUser(socketId, usersCopy);
        if (!findedUser) {
            return console.log('Uzytkownik nie wpisał nazwy, a wiec nie mial rekordu.');
        }
        console.log('Usuwam uzytkownika');

        data.users = usersCopy.filter(user => user.id != socketId);

    };

    socket.on('users:create', users_create);
    socket.on('disconnect', users_disconnect)
}

