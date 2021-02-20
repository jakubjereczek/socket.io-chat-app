import styled from 'styled-components';

import exit_icon from './images/exit_icon.png';
import send_icon from './images/send_icon.png';
import emoji_icon from './images/emoji_icon.png';
import human from './images/human.png';

export const Wrapper = styled.div`
    position: relative;
    height: 100%;
    max-height: 100vh;
    min-width: 300px;
    background-color: #fff;
`;

export const Header = styled.div`
    box-sizing: border-box;
    display: flex;
    background-color: #F6F6F6;
    width: 100%;
    height: 100px;
    color: #000;
    padding: 10px;

    & > div:nth-child(1) {
        flex-grow: 1;
    }


    & > div:nth-child(2) {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 64px;
        min-width: 64px;
        max-width: 64px;
        max-height: 64px;
        background-color: #C4C4C4;
        border-radius: 50%;

        @media (max-width: 900px) {
            min-height: 46px;
            min-width: 46px;
            max-width: 46px;
            max-height: 46px;
        }
    }
`;

export const ExitIcon = styled.div`
    width: 32px;
    height: 32px;
    background-image: url(${exit_icon});
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    transition: 0.6s;

    &:hover {
        transform: scale(1.2);
    }
`


export const Border = styled.div`
    position: absolute;

    min-height: 4px;
    height: auto;
    width: 100%;
    background-color: ${props => props.theme.dark_light};
    box-shadow: 3px 3px 15px 2px rgba(128,128,128,0.25);
    z-index: 2;
    transform: translateX(0vw);
    transition: all 2s ease;

`

export const Containter = styled.div`
    box-shadow: 3px 3px 15px 2px rgba(128,128,128,0.25);
    height: 70%;
    overflow-y: scroll;
`

export const MessageContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: ${props => props.gray ? "flex-end" : "flex-start"};
    transition: 1s;
`;

export const TypingMessageContainer = styled(MessageContainer)`
    /* position: absolute; */

`

export const Message = styled.div`
    display: flex;
    box-sizing: border-box;
    padding: 5px;
    margin: 5px 10px;
    color: #fff;
    width: auto;
    max-width: 60%;

    @media (max-width: 900px) {
        max-width: 70%;
        margin: 5px 2px;

    }
`;

export const MessageIcon = styled.div`
    width: 46px;
    height: 46px;
    background-color: ${props => props.gray ? "#808080" : props => props.theme.dark_light};
    border-radius: 50%;
    margin: 5px;
    flex-shrink: 0;

    background-image: url(${human});
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 90%;

    @media (max-width: 900px) {
        width: 32px;
        height: 32px;   
    }
`

export const MessageText = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    width: auto;
    background-color: ${props => props.gray ? "#808080" : props => props.theme.dark_light};
    margin: 0px 10px; 
    border-radius: 10px;
    padding: 10px;
    padding-bottom: 20px;
    width: 100%;
    min-width: 0;
    /* max-width: calc(100% - 94px); // 64 + plus margin, padding */
    flex-grow: 0;
    /* flex-grow:1; */
    word-wrap: break-word;

    & > span {
        z-index: 1;
        font-weight: 300;
    }

    @media (max-width: 900px) {
        max-width: 300px;
    }
    @media (max-width: 576px) {
        max-width: 200px;
        padding-bottom: 10px;
    }
`

export const MessageTypping = styled(MessageText)`
    overflow: hidden;

    & > span {
        animation: move 4s linear infinite;

        @keyframes move {
            0% {
                opacity: 0.15;
                transform: scale(1);
            }

            50% {
                opacity: 1;
                transform: scale(1.03);
            }

            100% {
                opacity: 0.15;
                transform: scale(1);

            }
        }

    }
`


export const MessageTriangle = styled.div`
    position: absolute;
    width: 32px;
    height: 32px;
    left: ${props => props.gray ? "auto" : "-6px"};
    right: ${props => props.gray ? "-6px" : "auto"};

    transform: rotate(45deg);
    background-color: pink;
    z-index: 1;
`

export const Author = styled.p`
    display: block;
    text-align: ${props => props.gray ? "end" : "start"};
    font-weight: 600;
    letter-spacing: 1.4px;
    z-index: 1;
    font-size: 1.1rem;
`;

export const InputContainer = styled.div`
    position: relative;
    display: flex;
    height: calc(30% - 100px);
    background-color: #F6F6F6;
    padding: 0px 10px;
    justify-items: center;
    align-items: center;

    & > div:nth-child(1) {
        display: flex;
        height: 80%;
        margin-right: 10px;
        
        flex-grow: 1;
        & ~ {
            margin: 10px;
        }
    }
    & > div:nth-child(2) {
        width: 64px;
        height: 64px;

        @media (max-width: 900px) {
            width: 46px;
            height: 46px;
        }
    }
`

export const SendButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.theme.dark_light};
    border-radius: 50%;
    width: inherit;
    height: inherit;
    border: 0;
`

export const SendIcon = styled.div`
    width: 32px;
    height: 32px;
    background-image: url(${send_icon});
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    transition: 0.6s;

    &:hover {
        transform: scale(1.2);
    }
`

export const Line = styled.div`
    width: 100%;
    border-bottom: 4px #F6F6F6 solid;
    text-align: center;
`

export const Online = styled.div`
    width: 0.8rem;
    height: 0.8rem;
    background-color: #6AD17A;
    display: inline-block;
    border-radius: 50%;
`;

export const Time = styled.p`
    position: absolute;
    color: #fff;
    bottom: 0px;
    font-size: 0.85rem;
    font-weight: 300;
    left: ${props => props.gray ? "10px" : "auto"};
    right: ${props => props.gray ? "auto" : "10px"};
    z-index: 1;
    @media (max-width: 576px) {
        font-size: 1rem;
    }
`

export const ScrollHiddenElement = styled.div`
  visibility: hidden;

`
export const EmojiContainer = styled.div`
    position: absolute;
    z-index: 1;
    top: calc(100% - 420px);
    left: calc(100% - 310px);
`;

export const EmojiClose = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -36px;
    right: 4px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
`

export const EmojiIcon = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    background-image: url(${emoji_icon});
    background-position: center center;
    background-size: cover;

    transition: 1.3s;

    &:hover {
        transform: rotate(360deg);
    }
`

export const UserList = styled.span`
    word-wrap: break-word;

    &:hover {
        position: absolute;
        width: inherit;
        height: auto;
        background-color: #C4C4C4;
        padding: 0px 10px;
        border-radius: 10px;
        margin: 0px 5px;
        max-width: 900px;
        color: #fff;

    }
`

