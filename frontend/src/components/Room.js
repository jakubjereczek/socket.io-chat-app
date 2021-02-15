import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useHistory } from "react-router-dom";

import { Wrapper, Header, Containter, MessageContainer, Message, MessageIcon, MessageText, Author, InputContainer, Line, ScrollHiddenElement } from './Room.css';
import { Title, Input, Button, TitleBold, TitleThin, Textarea } from './Styles.css'
import { toast } from 'react-toastify';

import { useSocket } from '../contexts/SocketContext';

const Room = () => {
    const socketContext = useSocket();
    const socket = socketContext.socket;
    const user = socketContext.user;
    const history = useHistory();
    let { id } = useParams();

    // all data about room (with messanges)
    const [data, setData] = useState(undefined);
    const [messages, setMessages] = useState([]);
    const [lastestMessages, setLatestMessanges] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isMessagesLoading, setMessagesLoading] = useState(false);
    const [buttonIsActive, setButtonIsActive] = useState(true);
    const [userIsReadingMessagesAbove, setuserIsReadingMessagesAbove] = useState(false);

    const scroll = useRef();
    const container = useRef();

    // Przy pierwszym wejsciu oraz przy wejsciu, wyjsciu innych osobnikow.
    const handleInitRoom = useCallback((room) => {
        setData(room);
        setIsLoading(false);
    }, [])

    const handleMessageList = useCallback((messages) => {
        // inicjalizacja wiadomosci, ktore zostały napisane przed dołączniem 
        setLatestMessanges(messages);
        // setIsLoading(false);
    });


    useEffect(() => {
        setIsLoading(true);
        socket.emit('rooms:get-room-request', id);
        socket.emit('rooms:get-sent-messages-request', id);

        socket.on('rooms:get-rooms', handleInitRoom);
        socket.on('rooms:get-sent-message', changeMessanges);
        socket.on('rooms:get-sent-messages-previously', handleMessageList)


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

    const changeMessanges = (type, message, userName) => {
        if (!isMessagesLoading) {
            setMessagesLoading(true);
            console.log('dostalem request dodania nowej wiadomosci');
            const newMessage = {
                author: userName,
                type,
                message
            }
            const messagesCopy = messages;
            messagesCopy.push(newMessage);
            setMessages(messagesCopy);
            setMessagesLoading(false);
        }
    };

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
        if (message.type === "message") {
            let Content;
            let gray;
            if (message.author === user.name) {
                gray = false;
                Content = (
                    <React.Fragment>
                        <MessageIcon>
                            {/* todo */}
                        </MessageIcon>
                        <MessageText>
                            <Author>{message.author}</Author>
                            {message.message}
                        </MessageText>
                    </React.Fragment>
                )
            } else {
                gray = true;
                Content = (
                    <React.Fragment>
                        <MessageText gray>
                            <Author gray>{message.author}</Author>
                            {message.message}
                        </MessageText>
                        <MessageIcon gray>
                            {/* todo */}
                        </MessageIcon>
                    </React.Fragment>
                )
            }
            return (
                <MessageContainer gray={gray}>
                    <Message>
                        {Content}
                    </Message>
                </MessageContainer>
            )
        } else if (message.type === "notification") {
            // wyswietlenie notyfikacji o dolaczeniu lub wyjsciu innej osoby. Twoja wiadomosc nie wyswietli się Tobie, a innym tak.
            if (message.author !== user.name) {
                return (
                    <MessageContainer gray>
                        <Message>
                            <MessageText gray>{message.author} {message.message}</MessageText>
                        </Message>
                    </MessageContainer>
                )
            }
        }
        // to do: is typing..
    }), [changeMessanges]);

    const ActiveUsers = (
        data && data.users.map((user, index) => {
            return (
                <span key={index}>{user.name}{data.users.length - 1 === index ? "" : ", "}</span>)
        })
    );

    // Wiadomości napisane przed dolączniem użytkownika.
    const LatestMess = (
        lastestMessages && lastestMessages.map(message => {
            let Content;
            let gray;
            if (message.type !== "message") {
                return;
            }
            if (message.author === user.name) {
                gray = false;
                Content = (
                    <React.Fragment>
                        <MessageIcon>
                            {/* todo */}
                        </MessageIcon>
                        <MessageText>
                            <Author>{message.author}</Author>
                            {message.message}
                        </MessageText>
                    </React.Fragment>
                )
            } else {
                gray = true;
                Content = (
                    <React.Fragment>
                        <MessageText gray>
                            <Author gray>{message.author}</Author>
                            {message.message}
                        </MessageText>
                        <MessageIcon gray>
                            {/* todo */}
                        </MessageIcon>
                    </React.Fragment>
                )
            }
            return (
                <MessageContainer gray={gray}>
                    <Message>
                        {Content}
                    </Message>
                </MessageContainer>
            )
        })
    )

    useEffect(() => {
        // Scrollowanie od ostatniej wiadomosci.
        if (!userIsReadingMessagesAbove) {
            scroll.current && scroll.current.scrollIntoView({ behavior: "auto" }) // przejdzie do ostatniej wiadomosci
        }
    }, [RenderedMessages]);

    if (!user || user.room !== id) {
        toast.warn("🦄 You're not allowed to connect to this chat or chat isn't exist");
        return (
            <React.Fragment>
                <h2>Error</h2>
                {history.push("/")}
            </React.Fragment>
        )
    }

    return (
        (!isLoading &&
            <Wrapper>
                <Header>
                    <div>
                        <div>
                            {data && (
                                <React.Fragment>
                                    <TitleBold>{data.name}</TitleBold>
                                    <TitleThin small>Online: {data.users.length} ({ActiveUsers})</TitleThin>
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
                    {LatestMess}
                    {/* 1 wiadomosc to powiadomienie o dołączeniu */}
                    {LatestMess.length > 1 ? <Line>
                        <TitleThin small>Chat messages above has been written before you joined the room</TitleThin>
                    </Line> : null}
                    {RenderedMessages}
                    <ScrollHiddenElement ref={scroll}>last</ScrollHiddenElement>
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