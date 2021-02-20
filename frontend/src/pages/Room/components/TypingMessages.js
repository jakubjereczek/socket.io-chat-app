import React, { useMemo } from 'react';

import { TypingMessageContainer, Message, MessageTypping, MessageIcon } from '../Room.css'

import { useSocket } from 'contexts/SocketContext';

const TypingMessages = ({ typingMessages }) => {

    const socketContext = useSocket();
    const user = socketContext.user;

    const renderMessages = (messages) => (
        messages && messages.map((message, index) => {
            if (message.author !== user.name) {
                return (
                    <TypingMessageContainer gray>
                        <Message>
                            <MessageTypping style={{ backgroundColor: message.chatColor }} gray><span>{message.author} is typing...</span></MessageTypping>
                            <MessageIcon style={{ backgroundColor: message.chatColor }} gray />
                        </Message>
                    </TypingMessageContainer>
                )

            }
        })
    );

    const messages = (
        renderMessages(typingMessages)
    )

    return (
        <React.Fragment>
            {messages.length > 0 ? messages : null}
        </React.Fragment>
    )

}

export default TypingMessages;