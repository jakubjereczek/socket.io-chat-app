import React, { useState, useEffect, useCallback } from 'react';
import { ListWrapper, ListElement } from './RoomsList.css';
import { Title, Button, TitleBold, TitleThin } from './Styles.css'

import { FaCalendarTimes, FaChalkboardTeacher, FaCog } from 'react-icons/fa';

import { useSocket } from '../contexts/SocketContext';
import { toast } from 'react-toastify';
import { useHistory } from "react-router-dom";


const RoomsList = () => {

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
                            <Button onClick={() => {
                                // zmiana najpierw w context
                                const newUser = {
                                    ...user,
                                    room: room.id
                                }
                                socketContext.setUser(newUser)
                                socket.emit('rooms:join', room.id, user.id);
                                history.push("/room/" + room.id);
                            }} gray small>Join to channel</Button>
                        </div>
                    </ListElement>
                ))}
            </ListWrapper>
        </React.Fragment >
    );
}

export default RoomsList;