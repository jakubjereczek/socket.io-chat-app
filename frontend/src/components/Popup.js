import React from 'react';
import { Wrapper, Container, TitlePopup, ReturnButton, Content } from './Popup.css';
import { FaAngleDoubleUp } from 'react-icons/fa';


const Popup = ({ children, changeActivePopup, title }) => {
    return (
        <Wrapper>
            <Container>
                <ReturnButton onClick={() => changeActivePopup()}><span><FaAngleDoubleUp /></span></ReturnButton>
                <TitlePopup>{title}</TitlePopup>
                <Content>
                    {children}
                </Content>
            </Container>
        </Wrapper>
    );
}

export default Popup;