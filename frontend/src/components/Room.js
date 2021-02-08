import React from 'react';
import { Wrapper, Header, Containter, MessageContainer, Message, MessageIcon, MessageText, Author, InputContainer } from './Room.css';
import { Title, Input, Button, TitleBold, TitleThin, Textarea } from './Styles.css'


const Room = () => {
    return (
        <Wrapper>
            <Header>
                <div>
                    <div>
                        <TitleBold>Pogaduchy 24/7</TitleBold>
                        <TitleThin small>Online: 3</TitleThin>
                    </div>
                </div>
                <div>
                    <Button gray>Exit</Button>
                </div>
            </Header>
            <Containter>
                <MessageContainer>
                    <Message>
                        <MessageIcon>
                            {/* todo */}
                        </MessageIcon>
                        <MessageText>
                            <Author>Jakubcio</Author>
                            SŁODKI SMACH CHWILI DZIAŁA TAK, ZE LEKOW NIE MUSZE BRAĆ
                    </MessageText>
                    </Message>
                </MessageContainer>
                <MessageContainer gray>
                    <Message>
                        <MessageText gray>
                            <Author gray>Nieznajomy</Author>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, soluta.
                        </MessageText>
                        <MessageIcon gray>
                            {/* todo */}
                        </MessageIcon>
                    </Message>
                </MessageContainer>
                <MessageContainer>
                    <Message>
                        <MessageIcon>
                            {/* todo */}
                        </MessageIcon>
                        <MessageText>
                            <Author>Jakubcio</Author>
                            *is typing...*
                    </MessageText>
                    </Message>
                </MessageContainer>
            </Containter>
            <InputContainer>
                <div>
                    <Textarea />
                </div>
                <div>
                    <Button>Send a message</Button>
                </div>
            </InputContainer>
        </Wrapper>
    );
}

export default Room;