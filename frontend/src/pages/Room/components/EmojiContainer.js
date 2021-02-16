import React, { useState } from 'react';

import Picker from 'emoji-picker-react';

import { FaRegCaretSquareDown } from 'react-icons/fa';

import { EmojiContainer as EmojiWrapper, EmojiClose } from '../Room.css';


const EmojiContainer = ({ emojiContainerVisible, textBoxValue, toggleEmojiContainer }) => {

    const [chosenEmoji, setChosenEmoji] = useState(null);

    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
        textBoxValue.current.value += emojiObject.emoji;
    };

    return (
        emojiContainerVisible ? (
            <EmojiWrapper>
                {/* Emoji picker */}
                <Picker onEmojiClick={onEmojiClick} pickerStyle={{ width: '300px', height: '300px' }} />
                <EmojiClose onClick={toggleEmojiContainer}><FaRegCaretSquareDown /></EmojiClose>
            </EmojiWrapper>
        ) : null
    );
}

export default EmojiContainer;