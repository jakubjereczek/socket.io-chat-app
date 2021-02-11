const users = [];
const rooms = [];

const getUser = (id, users) => {
    let findedUser = users.find(user => user.id === id);
    if (findedUser) {
        return findedUser;
    } else {
        return null;
    }
}

const getRoom = (id, rooms) => {
    let findedRoom = rooms.find(room => room.id === id);
    if (findedRoom) {
        return findedRoom;
    } else {
        return null;
    }

}

module.exports = {
    users,
    rooms,
    getUser,
    getRoom
};