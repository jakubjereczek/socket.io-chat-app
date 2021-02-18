import React, { useMemo } from 'react';

import { MessageContainer, Message, MessageIcon, MessageText, Author, Line, Time, MessageTriangle } from '../Room.css'
import { TitleThin } from 'components/Styles.css'

import { useSocket } from 'contexts/SocketContext';

import timeConverter from 'utils/timeConverter';

const MessagesList = ({ initMessages, messages }) => {

    // console.log("init", initMessages);
    // console.log("mess", messages);

    const socketContext = useSocket();
    const user = socketContext.user;

    const renderMessages = (messages) => (
        messages && messages.map((message, index) => {
            if (message.type === "message") {
                let Content;
                let gray;
                if (message.author === user.name) {
                    gray = false;
                    Content = (
                        <React.Fragment>
                            <MessageIcon style={{ backgroundColor: message.chatColor }} >
                                {/* todo */}
                            </MessageIcon>
                            <MessageText style={{ backgroundColor: message.chatColor }}>
                                <MessageTriangle style={{ backgroundColor: message.chatColor }} />
                                <Author>{message.author}</Author>
                                <span>{message.message}</span>
                                <Time>{timeConverter(message.time)}</Time>

                            </MessageText>
                        </React.Fragment>
                    )
                } else {
                    gray = true;
                    Content = (
                        <React.Fragment>
                            <MessageText style={{ backgroundColor: message.chatColor }} gray>
                                <MessageTriangle gray style={{ backgroundColor: message.chatColor }} />
                                <Author gray>{message.author}</Author>
                                <span>{message.message}</span>
                                <Time gray>{timeConverter(message.time)}</Time>
                            </MessageText>
                            <MessageIcon style={{ backgroundColor: message.chatColor }} gray>
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
                                <MessageText style={{ backgroundColor: message.chatColor }} gray>{message.author} {message.message}</MessageText>
                            </Message>
                        </MessageContainer>
                    )
                }
            }
            // to do: is typing..
        }));

    //Wiadomości napisane przed dolączniem użytkownika.
    const LatestMess = useMemo(() => (
        renderMessages(initMessages)
    ), [initMessages]);


    const RenderedMessages = useMemo(() => (
        renderMessages(messages)
    ), [messages]);

    return (
        <React.Fragment>
            {LatestMess}
            {LatestMess.length > 1 ? <Line>
                <TitleThin small>Chat messages above has been written before you joined the room</TitleThin>
            </Line> : null}
            {RenderedMessages}
        </React.Fragment>
    )

}

export default MessagesList;