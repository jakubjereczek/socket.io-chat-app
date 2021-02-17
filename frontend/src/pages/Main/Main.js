import React from 'react';

import { MainWrapper } from 'components/Styles.css'

import { useSocket } from 'contexts/SocketContext';

import Name from './components/Name';
import Profil from './components/Profil';
import RoomsList from './components/RoomsList';

const Main = ({ changeActivePopup, changePopUpContent }) => {
    const socketContext = useSocket();
    const user = socketContext.user;

    return (
        <React.Fragment>
            {!user && <Name />}
            <MainWrapper>
                {user && (
                    <React.Fragment>
                        <Profil changeActivePopup={changeActivePopup} changePopUpContent={changePopUpContent} />
                        <RoomsList changeActivePopup={changeActivePopup} changePopUpContent={changePopUpContent} />
                    </React.Fragment>
                )}
            </MainWrapper>
        </React.Fragment>

    );
}

export default Main;