import React, { useState, useEffect } from 'react';
import { Wrapper, WrapperInside } from './Name.css'
import { TitleBold, TitleThin, Title, Input, Button } from './Styles.css'

import { useSocket } from '../contexts/SocketContext';
import { toast } from 'react-toastify';

const Name = (props) => {

    const socketContext = useSocket();
    const socket = socketContext.socket;

    const [name, setName] = useState("");

    const buttonHandler = () => {
        if (name.length < 6) {
            return toast.warn("🦄 Your name should have 6 characters or more!");
        } else if (name.length > 32) {
            return toast.warn("🦄 Your name should have less than 32 characters!");
        }
        socket.emit('users:create', name);
    }

    const inputHandler = (e) => {
        const value = e.target.value;
        setName(value);
    }

    useEffect(() => {
        socket.on('users:create-success', (user) => {
            const { id, name } = user;
            toast.success("🦄 Welcome, " + name);
            // Ustawiamy User, dzieki temu mamy dane w contextcie i możemy korzystac na przestrzeni całej aplikacji. Do momentu gdy nie jest wypełniony wyświetlamy ten komponent.
            socketContext.setUser(user);
        })
    }, [socket]);

    return (
        <Wrapper>
            <WrapperInside>
                <TitleBold>Chat</TitleBold>
                <TitleThin>Real-time chat application using framework socket.io</TitleThin>
                <Title>Join the chat</Title>
                <Input onChange={inputHandler} />
                <Button onClick={buttonHandler}>Join</Button>
            </WrapperInside>
        </Wrapper >
    );
}

export default Name;