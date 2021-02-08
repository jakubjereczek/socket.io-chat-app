import React, { useState, useEffect } from 'react';
import { Wrapper, HeaderWrapper, DescribeWrapper } from './Profil.css';
import { Title, Input, Button, TitleBold, TitleThin } from './Styles.css'
import { useSocket } from '../contexts/SocketContext';
import { toast } from 'react-toastify';


const Profil = ({ changeActivePopup, changePopUpContent, isActivePopup }) => {

    const socketContext = useSocket();
    const socket = socketContext.socket;
    const user = socketContext.user;

    useEffect(() => {
        socket.on('rooms:create-success', (room) => {
            const { users, created_by, id, name } = room;
            const user = {
                id: users[0],
                name: created_by,
                room: id,
            }
            socketContext.setUser(user);
            toast.success("🦄 You has created a room: " + name);

            // unvisible
            changeActivePopup(false);
            // przejscie do chatu 
            // room/id
            // to do
        })

    }, [socket]);


    const nameRoom = React.createRef();
    const createRoom = () => {

        console.log('user.room ', user.room);
        if (user.room !== "") {
            return toast.warn("🦄 You already have a room.");
        } else if (nameRoom.current.value.length < 6) {
            return toast.warn("🦄 Room name should have 6 characters or more!");
        } else if (nameRoom.current.value.length > 32) {
            return toast.warn("🦄 Room name should have less than 32 characters!");
        }
        const room = {
            id: user.id,
            name: nameRoom.current.value,
            // to do
            private: false,
            created_by: user.name,
            created_time: Date.now(),
            users: [user.id]
        }
        socketContext.socket.emit('rooms:create', room);
    }

    const buttonHandler = () => {
        // Treść popupa
        const context = (
            <React.Fragment>
                <Title small>Name</Title>
                {/* to do: checkbox z potem do hasla + input po wybraniu tej opcji:) */}
                <Input ref={nameRoom} />
                <Title small>Submit</Title>
                <Button onClick={createRoom}>Create a room</Button>
            </React.Fragment>
        );

        const popupContext = {
            title: "Add new room",
            context
        }
        changePopUpContent(popupContext)
        // visible
        changeActivePopup(true);
    }

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