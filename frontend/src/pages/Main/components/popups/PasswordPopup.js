import React from 'react';
import { Title, Input, Button, TitleThin } from 'components/Styles.css'

const PasswordPopup = (changeActivePopup, changePopUpContent, checkPassword, room) => {

    const password = React.createRef();

    const context = (
        <React.Fragment>
            <Title small>Room is protected by password</Title>
            <Input ref={password} />
            <TitleThin small>Password is necessary to connect to that room.</TitleThin>
            <Button onClick={() => checkPassword(room, password.current.value)}>Join</Button>
        </React.Fragment>
    );

    const popupContext = {
        title: "Room with password",
        context
    }

    changePopUpContent(popupContext)
    changeActivePopup(true);
    // Nie zwracam nic, bo "zwracam", a de facto tylko zmieniam widoczność.
}

export default PasswordPopup;