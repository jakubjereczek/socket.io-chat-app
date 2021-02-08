import React from 'react';
import { useParams, useHistory } from "react-router-dom";

import { Wrapper, Header, Containter, MessageContainer, Message, MessageIcon, MessageText, Author, InputContainer } from './Room.css';
import { Title, Input, Button, TitleBold, TitleThin, Textarea } from './Styles.css'
import { toast } from 'react-toastify';


import { useSocket } from '../contexts/SocketContext';

const Room = () => {
    const socketContext = useSocket();
    const socket = socketContext.socket;
    const user = socketContext.user;
    console.log('user', user);
    const history = useHistory();
    let { id } = useParams();

    if (!user || user.room !== id) {
        toast.warn("🦄 You're not allowed to connect to this chat or chat isn't exist");
        // to do
        return history.push("/");
    }

    return (
        <Wrapper>
            <Header>
                <div>
                    <div>
                        <TitleBold>Pogaduchy 24/7</TitleBold>
                        <TitleThin small>Online: 3</TitleThin>
                    </div>
                </div>
                <div>
                    <Button onClick={() => {
                        const newUser = {
                            ...user,
                            room: ""
                        }
                        socketContext.setUser(newUser)
                        console.log('user.id', user.id);
                        socket.emit('rooms:leave', user.id);
                        toast.success("🦄 You left the chat");
                        history.push("/");
                    }} gray>Exit</Button>
                </div>
            </Header>
            <Containter>
                <MessageContainer>
                    <Message>
                        <MessageIcon>
                            {/* todo */}
                        </MessageIcon>
                        <MessageText>
                            <Author>Jakubcio</Author>
                            SŁODKI SMACH CHWILI DZIAŁA TAK, ZE LEKOW NIE MUSZE BRAĆ
                    </MessageText>
                    </Message>
                </MessageContainer>
                <MessageContainer gray>
                    <Message>
                        <MessageText gray>
                            <Author gray>Nieznajomy</Author>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, soluta.
                        </MessageText>
                        <MessageIcon gray>
                            {/* todo */}
                        </MessageIcon>
                    </Message>
                </MessageContainer>
                <MessageContainer>
                    <Message>
                        <MessageIcon>
                            {/* todo */}
                        </MessageIcon>
                        <MessageText>
                            <Author>Jakubcio</Author>
                            *is typing...*
                    </MessageText>
                    </Message>
                </MessageContainer>
            </Containter>
            <InputContainer>
                <div>
                    <Textarea />
                </div>
                <div>
                    <Button>Send a message</Button>
                </div>
            </InputContainer>
        </Wrapper>
    );
}

export default Room;