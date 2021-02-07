import React, { useState, useEffect } from 'react';
import { Wrapper, HeaderWrapper, DescribeWrapper } from './Profil.css';
import { Title, Input, Button, TitleBold, TitleThin } from './Styles.css'
import { useSocket } from '../contexts/SocketContext';

const Profil = ({ changeActivePopup, changePopUpContent }) => {

    const socketContext = useSocket();
    const user = socketContext.user;

    const buttonHandler = () => {
        // Treść popupa
        const context = (
            <React.Fragment>
                <Title small>Name</Title>
                <Input />
                <Button>Create a room</Button>
            </React.Fragment>
        );

        const popupContext = {
            title: "Add new room",
            context
        }
        changePopUpContent(popupContext)
        changeActivePopup();
        const room = {
            id: user.id,
            created_by: user.name,
            created_time: Date.now()
        }
        //socketContext.socket.emit('rooms:create', room);
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
                <Button onClick={buttonHandler}>add new room</Button>
                <DescribeWrapper>
                    <p>Join a chat created by another user or create your own.</p>
                </DescribeWrapper>
            </HeaderWrapper>
        </React.Fragment>
    );
}

export default Profil;