import React, { useEffect, useState } from 'react';

import { Textarea } from 'components/Styles.css'
import { toast } from 'react-toastify';

import { SendButton, SendIcon, EmojiIcon } from '../Room.css';

const Typing = ({ textBoxValue, user, socket, toggleEmojiContainer }) => {

    const [buttonIsActive, setButtonIsActive] = useState(true);

    const [userTapingRequest, setUserTapingRequest] = useState(false);
    const [userIsTyping, setUserIsTyping] = useState(false);

    const [timer, setTimer] = useState(null);

    const typingMessageHandler = () => {
        if (textBoxValue && textBoxValue.current.value.length > 6) {
            clearTimeout(timer);
            setUserIsTyping(true);
            timeout(userIsTyping);
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


    const sendNewMessageRequest = () => {
        const value = textBoxValue.current.value;
        if (value.length < 6) {
            return toast.warn("🦄 Message should have 6 chars or more!");
        }
        textBoxValue.current.value = ""

        // Usuniecie typing - przed wyświetleniem wiadomosci.
        if (userIsTyping) {
            clearTimeout(timer);
            setUserTapingRequest(false);
            socket.emit('rooms:delete-message', "typing", user.name, user.room);
        }
        socket.emit('rooms:send-message', "message", value, user.name, user.room, user.chatColor, Date.now());

        setButtonIsActive(false);
        setTimeout(() => {
            setButtonIsActive(true);
        }, [200]) // 0.2 sek przerwy przed nastepna wiadomoscia 

    }

    return (
        <React.Fragment>
            <div>
                <Textarea onChange={typingMessageHandler} ref={textBoxValue} />
                <EmojiIcon onClick={toggleEmojiContainer} />
            </div>
            <div>
                <SendButton disabled={!buttonIsActive} onClick={sendNewMessageRequest}><SendIcon /></SendButton>
            </div>
        </React.Fragment>

    );
}

export default Typing;