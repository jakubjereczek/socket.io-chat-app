import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useHistory } from "react-router-dom";

import { Wrapper, Header, Containter, InputContainer, ScrollHiddenElement } from './Room.css';
import { Button, TitleBold, TitleThin, Textarea } from 'components/Styles.css'

import { FcLike } from "react-icons/fc";

import { toast } from 'react-toastify';
import { useSocket } from 'contexts/SocketContext';

import MessagesList from './components/MessagesList';
import EmojiContainer from './components/EmojiContainer';


const Room = () => {
    const socketContext = useSocket();
    const socket = socketContext.socket;
    const user = socketContext.user;
    const history = useHistory();
    let { id } = useParams();

    const [data, setData] = useState(undefined);
    const [messages, setMessages] = useState([]);
    const [lastestMessages, setLatestMessanges] = useState([]);

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
        socket.on('rooms:get-sent-message', changeMessanges);
        socket.on('rooms:get-sent-messages-previously', handleMessageList)

        return () => {
            socket.off('rooms:get-rooms', handleInitRoom);
            socket.off('rooms:get-sent-message', changeMessanges);
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

    const changeMessanges = (type, message, userName, chatColor, time) => {
        if (!isMessagesLoading) {
            setMessagesLoading(true);
            console.log('dostalem request dodania nowej wiadomosci');
            const newMessage = {
                author: userName,
                type,
                message,
                chatColor,
                time
            }
            const messagesCopy = messages;
            messagesCopy.push(newMessage);
            setMessages(messagesCopy);
            setMessagesLoading(false);
        }
    };

    const sendMessage = () => {
        const value = textBoxValue.current.value;
        if (value.length < 6) {
            return toast.warn("🦄 Message should have 6 chars or more!");
        }
        setButtonIsActive(false);
        const type = "message"
        const time = Date.now();
        socket.emit('rooms:send-message', type, value, user.name, user.room, user.chatColor, time);
        textBoxValue.current.value = ""
        setTimeout(() => {
            setButtonIsActive(true);
        }, [300]) // 0.3 sek przerwy przed nastepna wiadomoscia
    }

    const MessagesListComponent = (
        (messages && lastestMessages) ?
            (
                // Regenerownanie w przypadku pojawienia sie nowej wiadmosci
                !isMessagesLoading && <MessagesList initMessages={lastestMessages} messages={messages} />
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


    // UserList
    const ActiveUsers = (
        data && data.users.map((user, index) => {
            return (
                <span key={index}>{user.name}{data.users.length - 1 === index ? "" : ", "}</span>)
        })
    );

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
                                    <TitleBold>{data.name}</TitleBold>
                                    {/* to do: wyswietlenie kilku + hover ktory pokazuje wszystkich */}
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
                    {MessagesListComponent}
                    <ScrollHiddenElement ref={scroll}>last</ScrollHiddenElement>
                </Containter>
                <InputContainer>
                    <div>
                        <Textarea ref={textBoxValue} value={textBoxValue.current} />
                        <FcLike style={{ fontSize: '42px' }} onClick={toggleEmojiContainer} />
                    </div>
                    <div>
                        <Button disabled={!buttonIsActive} onClick={sendMessage}>Send a message</Button>
                    </div>
                </InputContainer>
                {EmojiContainerComponent}
            </Wrapper >
        )
    );
}

export default Room;