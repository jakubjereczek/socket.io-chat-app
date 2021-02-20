import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useHistory } from "react-router-dom";

import { Wrapper, Header, Containter, InputContainer, ScrollHiddenElement, Border, Online, ExitIcon } from './Room.css';
import { TitleThin } from 'components/Styles.css'

import { toast } from 'react-toastify';
import { useSocket } from 'contexts/SocketContext';

import MessagesList from './components/MessagesList';
import EmojiContainer from './components/EmojiContainer';
import ActiveUsers from './components/ActiveUsers';
import Typing from './components/Typing';
import TypingMessages from './components/TypingMessages';

const Room = () => {
    const socketContext = useSocket();

    const socket = socketContext.socket;
    const user = socketContext.user;
    const history = useHistory();

    let { id } = useParams();

    const [data, setData] = useState(undefined);
    const [messages, setMessages] = useState([]);
    const [lastestMessages, setLatestMessanges] = useState([]);
    const [typingMessages, setTypingMessages] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isMessagesLoading, setMessagesLoading] = useState(false);
    const [isTypingMessagesLoading, setTypingMessagesLoading] = useState(false);
    const [userIsReadingMessagesAbove, setuserIsReadingMessagesAbove] = useState(false);
    const [emojiContainerVisible, setEmojiContainerVisible] = useState(false);

    const textBoxValue = React.createRef();
    const scrollElementRef = useRef();
    const containerElementRef = useRef();

    const toggleEmojiContainer = () => setEmojiContainerVisible(!emojiContainerVisible);

    // Przy pierwszym wejsciu oraz przy wejsciu, wyjsciu innych osobnikow.
    const handleInitRoom = useCallback((room) => {
        setData(room);
        setIsLoading(false);
    }, [])

    const handleMessageList = useCallback((messages) => {
        // inicjalizacja wiadomosci, ktore zostały napisane przed dołączniem 
        setLatestMessanges(messages);
    }, []);


    useEffect(() => {
        setIsLoading(true);
        socket.emit('rooms:get-room-request', id);
        socket.emit('rooms:get-sent-messages-request', id);

        socket.on('rooms:get-rooms', handleInitRoom);
        socket.on('rooms:get-sent-message', addNewMessageResponse);
        socket.on('rooms:get-sent-messages-previously', handleMessageList)

        return () => {
            socket.off('rooms:get-rooms', handleInitRoom);
            socket.off('rooms:get-sent-message', addNewMessageResponse);
            socket.off('rooms:get-sent-messages-previously', handleMessageList)
        }
    }, [])

    const scrollAboveController = () => {
        const condition = scrollElementRef.current.getBoundingClientRect().y - containerElementRef.current.getBoundingClientRect().height > 100;
        // ok. 100 px nad ostatnią wiadomoscia - wtedy nie scrollować automatycznie wiadomosci

        condition ? setuserIsReadingMessagesAbove(true) : setuserIsReadingMessagesAbove(false);
    }

    // Rozwiąanie problemu z pobieraniem starej wartości z domkniecia (closure).
    // useRef + useEffect.
    const typingMessagesLatestValue = useRef(typingMessages);
    useEffect(() => {
        typingMessagesLatestValue.current = typingMessages;
    });

    const addNewMessageResponse = (type, message, userName, chatColor, time) => {
        // Refresh - wywoływany gdy usuwamy message: typing.
        let typingMessagesCopy = typingMessagesLatestValue.current;

        const newMessage = {
            author: userName,
            type,
            message,
            chatColor,
            time
        }

        switch (type) {
            // Gdy usuwamy wiadomość (typing).
            case 'refresh':
                setTypingMessagesLoading(true);
                typingMessagesCopy = typingMessagesCopy.filter(message => {
                    console.log(userName, message.author);
                    if (message.author === userName && message.type === "typing") {
                        return false;
                    }
                    return true;
                })
                setTypingMessages(typingMessagesCopy);
                setTypingMessagesLoading(false);
                break;
            // Gdy dodajemy wiadomość (typing).
            case 'typing':
                setTypingMessagesLoading(true);
                typingMessagesCopy.push(newMessage);
                setTypingMessages(typingMessagesCopy);
                setTypingMessagesLoading(false);
                break;
            case 'message':
                setMessagesLoading(true);
                const messagesCopy = messages;
                messagesCopy.push(newMessage);
                setMessages(messagesCopy);
                setMessagesLoading(false);
                break;
        }

    };

    const exitRoom = () => {
        const newUser = {
            ...user,
            room: ""
        }
        socketContext.setUser(newUser)
        socket.emit('rooms:leave', user.id);
        toast.success("🦄 You left the chat");
        history.push("/");
    }

    const MessagesListComponent = (
        !isMessagesLoading && <MessagesList initMessages={lastestMessages} messages={messages} />
    )

    const TypingMessagesComponent = (
        !isTypingMessagesLoading && <TypingMessages typingMessages={typingMessages} />
    )

    const EmojiContainerComponent = useMemo(() => (
        (textBoxValue != null) && (
            <EmojiContainer emojiContainerVisible={emojiContainerVisible} textBoxValue={textBoxValue} toggleEmojiContainer={toggleEmojiContainer} />
        )
    ), [textBoxValue, emojiContainerVisible])

    const TypingComponent = useMemo(() => (
        <Typing textBoxValue={textBoxValue} user={user} socket={socket} toggleEmojiContainer={toggleEmojiContainer} />
    ), [textBoxValue]);


    useEffect(() => {
        // Scrollowanie od ostatniej wiadomosci.
        if (!userIsReadingMessagesAbove) {
            setTimeout(() => {
                scrollElementRef.current && scrollElementRef.current.scrollIntoView({ behavior: "auto" }) // przejdzie do ostatniej wiadomosci
            }, 100)
        }
    }, [MessagesListComponent]);

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
            < Wrapper >
                <Header>
                    <div>
                        <div>
                            <TitleThin><span>{data.name}</span></TitleThin>
                            <TitleThin small><Online /> <ActiveUsers users={data.users} />
                            </TitleThin>
                        </div>
                    </div>
                    <div onClick={exitRoom}>
                        <ExitIcon />
                    </div>
                </Header>
                <Border>
                    {TypingMessagesComponent}
                </Border>
                <Containter ref={containerElementRef} onScroll={scrollAboveController}>
                    {MessagesListComponent}
                    <ScrollHiddenElement ref={scrollElementRef}>last</ScrollHiddenElement>
                </Containter>
                <Border />
                <InputContainer>
                    {TypingComponent}
                </InputContainer>
                {EmojiContainerComponent}
            </Wrapper >
        )
    );
}

export default Room;