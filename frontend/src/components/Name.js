import React, { useState, useEffect } from 'react';
import { Wrapper, WrapperInside, Title, Input, Button } from './Name.css'
import { useSocket } from '../contexts/SocketContext';
import { toast } from 'react-toastify';

const Name = () => {

    const socketContext = useSocket();
    const socket = socketContext.socket;

    const [name, setName] = useState("");

    const buttonHandler = () => {
        if (name.length < 6) {
            return toast.warn("🦄 Your name should have 6 characters or more!");
        }
        socket.emit('name', name);
    }

    const inputHandler = (e) => {
        const value = e.target.value;
        setName(value);
    }

    useEffect(() => {
        socket.on('name-success', (user) => {
            const { id, name } = user;
            toast.success("🦄 Welkome, " + name);
            socketContext.setUser(user);
            console.log('socketContext.user', socketContext.user);
        })
    }, [socket]);

    return (
        <Wrapper>
            <WrapperInside>
                <Title>Join the chat</Title>
                <Input onChange={inputHandler} />
                <Button onClick={buttonHandler}>Join</Button>
            </WrapperInside>
        </Wrapper >
    );
}

export default Name;