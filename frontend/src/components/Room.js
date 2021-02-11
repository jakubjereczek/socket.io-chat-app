import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useHistory } from "react-router-dom";

import { Wrapper, Header, Containter, MessageContainer, Message, MessageIcon, MessageText, Author, InputContainer } from './Room.css';
import { Title, Input, Button, TitleBold, TitleThin, Textarea } from './Styles.css'
import { toast } from 'react-toastify';

import { useSocket } from '../contexts/SocketContext';

const Room = () => {
    const socketContext = useSocket();
    const socket = socketContext.socket;
    const user = socketContext.user;
    const history = useHistory();
    let { id } = useParams();

    const [data, setData] = useState(undefined);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [buttonIsActive, setButtonIsActive] = useState(true);
    const [isScrollDone, setIsScrollDone] = useState(false);
    const [userIsReadingMessagesAbove, setuserIsReadingMessagesAbove] = useState(false);

    const scroll = useRef();
    const container = useRef();

    const handleInitRoom = useCallback((room) => {
        setData(room);
        setIsLoading(false);
    })

    useEffect(() => {
        socket.emit('rooms:get-room-request', id);

        socket.on('rooms:get-rooms', handleInitRoom);
        socket.on('rooms:get-sent-message', changeMessanges);

        return () => {
            socket.off('rooms:get-rooms', handleInitRoom);
            socket.off('rooms:get-sent-message', changeMessanges);
        }

    }, [])

    const scrollManager = () => {
        if (scroll.current.getBoundingClientRect().y - container.current.getBoundingClientRect().height > 100) {
            // ok. 100 px nad ostatnią wiadomoscia - wtedy nie scrollować automatycznie wiadomosci
            setuserIsReadingMessagesAbove(true);
        } else {
            setuserIsReadingMessagesAbove(false);
        }
    }

    const changeMessanges = useCallback((type, message, userName) => {
        // if (!isLoading) {
        const newMessage = {
            author: userName,
            type,
            message
        }
        const messagesCopy = messages;
        messagesCopy.push(newMessage);
        setMessages(messagesCopy);

        if (!userIsReadingMessagesAbove) {
            // generuje tylko gdy nie czyta wyzej 100 px od lat messagw
            changeMessangesRequest();
            setIsScrollDone(false);
            setIsLoading(false);
        }
        // }
    }, [isLoading, setIsLoading]);

    const changeMessangesRequest = () => {
        console.log('REGENERUJE LOL!!!');
    }

    const textBoxValue = React.createRef();
    const sendMessage = () => {
        setButtonIsActive(false);

        const value = textBoxValue.current.value;
        const type = "message"
        socket.emit('rooms:send-message', type, value, user.name, user.room);
        textBoxValue.current.value = ""
        setTimeout(() => {
            setButtonIsActive(true);
        }, [300]) // 0.3 sek przerwy przed nastepna wiadomoscia
    }

    const RenderedMessages = useMemo(() => messages.map((message, index) => {
        if (message.author === user.name) {
            if (message.type === "message") {
                return (
                    <MessageContainer ref={scroll}>
                        <Message>
                            <MessageIcon>
                                {/* todo */}
                            </MessageIcon>
                            <MessageText>
                                <Author>{message.author}</Author>
                                {message.message}
                            </MessageText>
                        </Message>
                    </MessageContainer>
                )
            }
        } else {
            if (message.type === "message") {
                return (
                    <MessageContainer ref={scroll} gray>
                        <Message>
                            <MessageText gray>
                                <Author gray>{message.author}</Author>
                                {message.message}
                            </MessageText>
                            <MessageIcon gray>
                                {/* todo */}
                            </MessageIcon>
                        </Message>
                    </MessageContainer>
                )
            } else if (message.type === "notification") {
                // wyswietlenie notyfikacji o dolaczeniu lub wyjsciu innej osoby. Twoja wiadomosc nie wyswietli się Tobie, a innym tak.?
                return (
                    <MessageContainer ref={scroll} gray>
                        <Message>
                            <MessageText gray>{message.author} {message.message}</MessageText>
                        </Message>
                    </MessageContainer>
                )
            }
        }
        // to do: is typing..
    }), [changeMessangesRequest]);

    useEffect(() => {
        // Scrollowanie od ostatniej wiadomosci.
        if (!userIsReadingMessagesAbove) {
            console.log('PRZENOSZE NA DOL');
            scroll.current && scroll.current.scrollIntoView({ behavior: "auto" })
        }
        setIsScrollDone(true);
    }, [RenderedMessages]);

    if (!user || user.room !== id) {
        toast.warn("🦄 You're not allowed to connect to this chat or chat isn't exist");
        // to do
        return history.push("/");
    }

    return (
        (!isLoading &&
            <Wrapper>
                <Header>
                    <div>
                        <div>
                            {data && (
                                <React.Fragment>
                                    {console.log(data)}

                                    <TitleBold>{data.name}</TitleBold>
                                    <TitleThin small>Online: {data.users.length}</TitleThin>
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                    <div>
                        <Button onClick={() => {
                            const newUser = {
                                ...user,
                                room: ""
                            }
                            socketContext.setUser(newUser)
                            socket.emit('rooms:leave', user.id);
                            toast.success("🦄 You left the chat");
                            history.push("/");
                        }} gray>Exit</Button>
                    </div>
                </Header>
                <Containter ref={container} onScroll={scrollManager}>
                    {isScrollDone && RenderedMessages}
                </Containter>
                <InputContainer>
                    <div>
                        <Textarea ref={textBoxValue} value={textBoxValue.current} />
                    </div>
                    <div>
                        <Button disabled={!buttonIsActive} onClick={sendMessage}>Send a message</Button>
                    </div>
                </InputContainer>
            </Wrapper >
        )
    );
}

export default Room;
