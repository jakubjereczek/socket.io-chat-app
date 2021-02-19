import React, { useState, useMemo } from 'react';
import { UserList } from '../Room.css';

const ActiveUsers = ({ users }) => {

    const [isListFull, setListFull] = useState(false);

    const handleList = (type) => {
        if (type === "enter") {
            !isListFull && setListFull(true);
        } else if (type === "leave") {
            isListFull && setListFull(false);
        }
    };

    const usersList = useMemo(() => {
        let result = "";

        users.forEach((user, index) => {
            return (
                result += `${user.name}${users.length - 1 === index ? "" : ", "}`
            )
        })

        if (!isListFull) {
            return result.length > 64 ? users.length + " " + `${result.substring(0, 64)}...` : users.length + " " + result
        } else {
            return users.length + " people are online right now. Users: " + result;
        }
    }, [handleList]);


    return (
        <UserList onMouseEnter={() => handleList("enter")} onMouseLeave={() => handleList("leave")} >{usersList} </UserList>
    );
}

export default ActiveUsers;