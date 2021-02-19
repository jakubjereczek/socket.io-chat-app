import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useHistory } from "react-router-dom";

import { Wrapper, Header, Containter, InputContainer, ScrollHiddenElement, Border, Online, ExitIcon, SendButton, SendIcon, EmojiIcon } from './Room.css';
import { TitleThin, Textarea } from 'components/Styles.css'

import { toast } from 'react-toastify';
import { useSocket } from 'contexts/SocketContext';

import MessagesList from './components/MessagesList';
import EmojiContainer from './components/EmojiContainer';
import ActiveUsers from './components/ActiveUsers';
import Typing from './components/Typing';


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
    const [buttonIsActive, setButtonIsActive] = useState(true);
    const [userIsReadingMessagesAbove, setuserIsReadingMessagesAbove] = useState(false);
    const [emojiContainerVisible, setEmojiContainerVisible] = useState(false);

    const textBoxValue = React.createRef();
    const scroll = useRef();
    const container = useRef();

    const toggleEmojiContainer = () => setEmojiContainerVisible(!emojiContainerVisible);

    // Przy pierwszym wejsciu oraz przy wejsciu, wyjsciu innych osobnikow.
    const handleInitRoom = useCallback((room) => {
        setData(room);
        setIsLoading(false);
    }, [])

    const handleMessageList = useCallback((messages) => {
        // inicjalizacja wiadomosci, ktore zostały napisane przed dołączniem 
        setLatestMessanges(messages);
        // setIsLoading(false);
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

    const scrollManager = () => {
        if (scroll.current.getBoundingClientRect().y - container.current.getBoundingClientRect().height > 100) {
            // ok. 100 px nad ostatnią wiadomoscia - wtedy nie scrollować automatycznie wiadomosci
            setuserIsReadingMessagesAbove(true);
        } else {
            setuserIsReadingMessagesAbove(false);
        }
    }

    // Rozwiazanie problemu z hook useState.
    // Ciagle pobieralismy dane z closure.
    // Odswiezamy dane uzywajac useRef + useEffect.
    // https://stackoverflow.com/questions/55154186/react-hooks-usestateuseeffectevent-gives-stale-state?answertab=oldest#tab-top
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
        if (type === "refresh") {
            setMessagesLoading(true);
            typingMessagesCopy = typingMessagesCopy.filter(message => {
                console.log(userName, message.author);
                if (message.author === userName && message.type === "typing") {
                    return false;
                }
                return true;
            })
            setTypingMessages(typingMessagesCopy);
            setMessagesLoading(false);
            // Dodanie message typing.
        } else if (type === "typing") {
            setMessagesLoading(true);
            typingMessagesCopy.push(newMessage);
            setTypingMessages(typingMessagesCopy);
            setMessagesLoading(false);
        } else {
            // Reszta wiadomosci.
            if (!isMessagesLoading) {
                setMessagesLoading(true);
                const messagesCopy = messages;
                messagesCopy.push(newMessage);
                setMessages(messagesCopy);
                setMessagesLoading(false);
            }
        }
    };

    const sendNewMessageRequest = () => {
        const value = textBoxValue.current.value;
        if (value.length < 6) {
            return toast.warn("🦄 Message should have 6 chars or more!");
        }

        // Sprawdzenie czy istnieje wiadomosc "type: typing:" i usuniecie jej gdy takowa istnieje.
        socket.emit('rooms:delete-message', "typing", user.name, user.room);

        setButtonIsActive(false);
        socket.emit('rooms:send-message', "message", value, user.name, user.room, user.chatColor, Date.now());
        textBoxValue.current.value = ""
        setTimeout(() => {
            setButtonIsActive(true);
        }, [300]) // 0.3 sek przerwy przed nastepna wiadomoscia
    }

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
        (messages && lastestMessages && typingMessages) ?
            (
                // Regenerownanie w przypadku pojawienia sie nowej wiadmosci
                !isMessagesLoading && <MessagesList initMessages={lastestMessages} messages={messages} typingMessages={typingMessages} />
            ) :
            (
                <h2>Data is loading...</h2>
            )
    )

    const EmojiContainerComponent = useMemo(() => (
        (textBoxValue != null) && (
            <EmojiContainer emojiContainerVisible={emojiContainerVisible} textBoxValue={textBoxValue} toggleEmojiContainer={toggleEmojiContainer} />
        )
    ), [textBoxValue, emojiContainerVisible])

    const TypingComponent = useMemo(() => (
        <Typing textBoxValue={textBoxValue} user={user} socket={socket} />
    ), [textBoxValue]);


    useEffect(() => {
        // Scrollowanie od ostatniej wiadomosci.
        if (!userIsReadingMessagesAbove) {
            scroll.current && scroll.current.scrollIntoView({ behavior: "auto" }) // przejdzie do ostatniej wiadomosci
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
            <Wrapper>
                <Header>
                    <div>
                        <div>
                            {data && (
                                <React.Fragment>
                                    <TitleThin><span>{data.name}</span></TitleThin>
                                    <TitleThin small><Online /> <ActiveUsers users={data.users} />
                                    </TitleThin>
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                    <div onClick={exitRoom}>
                        <ExitIcon />
                    </div>
                </Header>
                <Border />
                <Containter ref={container} onScroll={scrollManager}>
                    {MessagesListComponent}
                    <ScrollHiddenElement ref={scroll}>last</ScrollHiddenElement>
                </Containter>
                <Border />
                <InputContainer>
                    <div>
                        {TypingComponent}
                        <EmojiIcon onClick={toggleEmojiContainer} />
                    </div>
                    <div>
                        <SendButton disabled={!buttonIsActive} onClick={sendNewMessageRequest}><SendIcon /></SendButton>
                    </div>
                </InputContainer>
                {EmojiContainerComponent}
            </Wrapper >
        )
    );
}

export default Room;