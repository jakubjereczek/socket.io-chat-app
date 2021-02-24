import React, { useState, useEffect } from 'react';
import { Wrapper, WrapperInside } from './Name.css'
import { TitleBold, TitleThin, Title, Input, Button } from 'components/Styles.css'

import { useSocket } from 'contexts/SocketContext';
import { toast } from 'react-toastify';

import { useGeneratorColor } from 'hooks';

const Name = () => {

    const socketContext = useSocket();

    const socket = socketContext.socket;

    const [name, setName] = useState("");

    const color = useGeneratorColor();

    const buttonHandler = () => {
        if (name.length < 6) {
            return toast.warn("🦄 Your name should have 6 characters or more!");
        } else if (name.length > 32) {
            return toast.warn("🦄 Your name should have less than 32 characters!");
        }
        // Wygenerowanie losowego koloru dla uzytkownika.
        // Kolor jest przypisany do konta.
        const user = {
            name,
            room: "",
            chatColor: color
        }
        socket.emit('users:create', user);
    }

    const inputHandler = (e) => {
        const value = e.target.value;
        setName(value);
    }

    useEffect(() => {
        socket.on('users:create-success', (user) => {
            const { id, name, chatColor } = user;

            const newUser = {
                id,
                name,
                room: "",
                chatColor,
            }
            toast.success("🦄 Welcome, " + name);
            // Ustawiamy User, dzieki temu mamy dane w contextcie i możemy korzystac na przestrzeni całej aplikacji. Do momentu gdy nie jest wypełniony wyświetlamy ten komponent.
            socketContext.setUser(newUser);
        })

        socket.on('users:create-failed', (user) => {
            toast.warn("🦄 Somebody with that name (" + user.name + ") is connected.");
            socketContext.setUser(null);
        });
    }, [socket]);

    return (
        <Wrapper>
            <WrapperInside>
                <TitleBold>ChatApp 🦄</TitleBold>
                <TitleThin>Real-time chat application using framework socket.io</TitleThin>
                <Title>Join the chat</Title>
                <Input onChange={inputHandler} />
                <Button onClick={buttonHandler}>Join</Button>
            </WrapperInside>
        </Wrapper >
    );
}

export default Name;