import React from 'react';
import { Title, Input, Button, TitleThin } from 'components/Styles.css'

const CreateRoomPopup = (changeActivePopup, changePopUpContent, createRoom, nameRoom, password) => {

    // Treść popupa
    const context = (
        <React.Fragment>
            <Title small>Name</Title>
            <Input ref={nameRoom} />
            <Title small> Password
            </Title>
            <Input id="password" ref={password} />
            <TitleThin small>If you want the room to be available without a password. Leave the field above empty.</TitleThin>
            {/* // i jesli jest true to rozwijamy haslo input */}
            <Title small>Submit</Title>
            {/* Funkcja wywołana w komponencie Profil */}
            <Button onClick={createRoom}>Create a room</Button>
        </React.Fragment>
    );

    const popupContext = {
        title: "Add new room",
        context
    }
    changePopUpContent(popupContext)
    changeActivePopup(true);
}

export default CreateRoomPopup;