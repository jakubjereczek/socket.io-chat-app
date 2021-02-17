import React, { useState, useEffect, useCallback } from 'react';
import { ListWrapper, ListElement } from './RoomsList.css';
import { Title, Button, TitleBold, TitleThin } from 'components/Styles.css'

import { FaCalendarTimes, FaChalkboardTeacher, FaCog } from 'react-icons/fa';

import { useSocket } from 'contexts/SocketContext';
import { toast } from 'react-toastify';
import { useHistory } from "react-router-dom";

import PasswordPopup from './popups/PasswordPopup';


const RoomsList = ({ changeActivePopup, changePopUpContent }) => {

    const socketContext = useSocket();
    const socket = socketContext.socket;
    const user = socketContext.user;
    const history = useHistory();

    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const handleRefreshRooms = useCallback((rooms) => {
        console.log('wykonuje refresh - funkcja');
        if (rooms.length === 0) {
            setData([]);
            return toast.warn("🦄 There are no active chats. Create own room.");
        }
        toast.success("🦄 Refresh the list with rooms");
        const newState = [...rooms];
        setData(newState);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        socket.emit('rooms:refresh-rooms-request');
        console.log('aaa');
        socket.on('rooms:refresh-rooms', handleRefreshRooms);

        return () => {
            socket.off('rooms:refresh-rooms', handleRefreshRooms);
        }
    }, []);

    // W przypadku gdy pokoj nie jest publiczny.
    const checkPassword = (room, password) => {
        console.log('room', room);
        console.log('password', password);
        if (room.password !== password) {
            return toast.warn("🦄 Password is not correct!");
        }
        joinProcess(room);
        // + wylaczenie popupu
        changeActivePopup(false);
    }

    const joinToRoom = (room) => {
        if (!room.private) {
            // zmiana najpierw w context
            joinProcess(room);
        } else {
            // popup z haslem - a potem wywolujemy funkcje wyzej 
            PasswordPopup(changeActivePopup, changePopUpContent, checkPassword, room)
        }
    }

    const joinProcess = (room) => {
        const newUser = {
            ...user,
            room: room.id
        }
        socketContext.setUser(newUser)
        socket.emit('rooms:join', room.id, user.id);
        history.push("/room/" + room.id);
    }

    return (
        <React.Fragment>
            <ListWrapper>
                {!isLoading && data.map((room, index) => (
                    <ListElement>
                        <div>
                            <TitleBold>Room {index + 1}</TitleBold>
                            <Title small>{room.name}</Title>
                        </div>
                        <div>
                            <TitleThin small><span><FaCalendarTimes /> Created: {new Date(room.created_time).toLocaleString()}</span></TitleThin>
                            <TitleThin small><span><FaCalendarTimes /> Created by: {room.created_by}</span></TitleThin>
                            <TitleThin small><span><FaChalkboardTeacher /> Online: {room.users.length}</span></TitleThin>
                            <TitleThin small><span><FaCog /> Password: {room.private ? "yes" : "no"}</span></TitleThin>
                            <Button onClick={() => joinToRoom(room)} gray small>Join to channel</Button>
                        </div>
                    </ListElement>
                ))}
            </ListWrapper>
        </React.Fragment >
    );
}

export default RoomsList;