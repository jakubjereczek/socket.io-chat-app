import React, { useEffect, useState } from 'react';

import { Textarea } from 'components/Styles.css'

const Typing = ({ textBoxValue, user, socket }) => {

    const [userTapingRequest, setUserTapingRequest] = useState(false);
    const [userIsTyping, setUserIsTyping] = useState(false);

    const [timer, setTimer] = useState(null);

    const typingMessageHandler = () => {
        if (textBoxValue && textBoxValue.current.value.length > 6) {
            clearTimeout(timer);
            setUserIsTyping(true);
            timeout(userIsTyping);
            console.log('true');
        } else {
            setUserIsTyping(false);
        }
    }

    const timeout = (bool) => {
        if (!userTapingRequest) {
            // Wysłanie requestu z wiadomością o tym, ze użytkownik pisze.
            socket.emit('rooms:send-message', "typing", "is typing", user.name, user.room, user.chatColor, Date.now());
        }
        setUserTapingRequest(true);
        if (userIsTyping) {
            setTimer(setTimeout(() => {
                console.log();
                console.log('false');
                setUserIsTyping(bool);
                setUserTapingRequest(false); // Po czasie - nieprzerwane 4 sekundy bez dodania nowego tekstu.

                // Wysłanie request o usunięcie wiadomości, ze użytkownik pisze.
                socket.emit('rooms:delete-message', "typing", user.name, user.room);
            }, 4000));
        }
    };

    return (
        <Textarea onChange={typingMessageHandler} ref={textBoxValue} />
    );
}

export default Typing;