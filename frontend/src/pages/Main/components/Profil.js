import React, { useState, useEffect } from 'react';
import { Wrapper, HeaderWrapper, DescribeWrapper } from './Profil.css';
import { Title, Input, Button, TitleBold, TitleThin } from 'components/Styles.css'
import { useSocket } from 'contexts/SocketContext';
import { toast } from 'react-toastify';
import { useHistory } from "react-router-dom";

import { useGeneratorId } from 'hooks';

import CreateRoomPopup from './popups/CreateRoomPopup';

const Profil = ({ changeActivePopup, changePopUpContent, isActivePopup }) => {

    const socketContext = useSocket();
    const socket = socketContext.socket;
    const user = socketContext.user;
    const history = useHistory();

    const id = useGeneratorId();

    const handleCreateRoom = (room) => {
        const { created_by, id, name } = room;

        const userObject = {
            id: user.id,
            name: created_by,
            room: id,
            chatColor: user.chatColor,
        }
        socketContext.setUser(userObject);
        toast.success("🦄 You has created a room: " + name);

        // unvisible
        changeActivePopup(false);
        // przejscie do chatu 
        socket.emit('rooms:join', id, user.id);
        history.push("/room/" + id);
    };

    useEffect(() => {
        socket.on('rooms:create-success', handleCreateRoom);

        return () => {
            socket.off('rooms:create-success', handleCreateRoom);
        }
    }, []);

    const nameRoom = React.createRef();
    const password = React.createRef();

    const createRoom = () => {
        console.log('user.room ', user.room);
        if (user.room !== "") {
            return toast.warn("🦄 You already have a room.");
        } else if (nameRoom.current.value.length < 6) {
            return toast.warn("🦄 Room name should have 6 characters or more!");
        } else if (nameRoom.current.value.length > 32) {
            return toast.warn("🦄 Room name should have less than 32 characters!");
        }
        // id - losowy ciag znakow 12 generowany przez hook
        console.log('password.current.value ', password.current.value);
        const room = {
            id: id,
            userId: user.id,
            name: nameRoom.current.value,
            // to do
            private: password.current.value ? true : false,
            password: password.current.value,
            created_by: user.name,
            created_time: Date.now(),
            // users: [user.id]
            users: []
        }
        socketContext.socket.emit('rooms:create', room);
    }


    // Logika w CreateRoomPopup
    const buttonHandler = () => CreateRoomPopup(changeActivePopup, changePopUpContent, createRoom, nameRoom, password);


    return (
        <React.Fragment>
            <Wrapper>
                <div>
                    <TitleBold>ChatApp</TitleBold>
                    <TitleThin>Hi, <span>{user.name}</span>.</TitleThin>
                </div>
            </Wrapper>
            <HeaderWrapper>
                {/* open popup */}
                <Button onClick={buttonHandler}>add new room</Button>
                <DescribeWrapper>
                    <p>Join a chat created by another user or create your own.</p>
                </DescribeWrapper>
            </HeaderWrapper>
        </React.Fragment>
    );
}

export default Profil;