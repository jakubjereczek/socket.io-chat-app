import './App.css';
import React, { useState, useMemo } from 'react';
// import { io } from "socket.io-client";
import { ThemeProvider } from "styled-components";
import { IconContext } from "react-icons"

import Colors from './utils/colors';
import { GlobalStyle } from './utils/globalStyles.js'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MainWrapper } from './components/Styles.css'

import { Name, Profil, RoomsList, Popup } from './components';

import { useSocket } from './contexts/SocketContext';

toast.configure();

function App() {

  const socketContext = useSocket();
  const user = socketContext.user;

  const [isActivePopup, setIsActivePopup] = useState(false);
  const [popupContent, setPopupContent] = useState({
    title: "Title",
    context: "Context"
  });

  const popupClass = {
    app: {
      active: "app blur",
      notActive: "app"
    },
  }
  const changeActivePopup = () => isActivePopup ? setIsActivePopup(false) : setIsActivePopup(true);
  const changePopUpContent = (txt) => setPopupContent(txt);
  const pContent = useMemo(() => {
    return popupContent;
  }, [changePopUpContent]);

  return (
    <ThemeProvider theme={Colors}>
      <IconContext.Provider value={{ style: { fontSize: '24px' } }}>
        {isActivePopup ? <Popup changeActivePopup={changeActivePopup} title={pContent.title}>{pContent.context}</Popup> : null}
        <div className={isActivePopup ? popupClass.app.active : popupClass.app.notActive}>
          <GlobalStyle />
          {!user && <Name />}
          <MainWrapper>
            {user && (
              <React.Fragment>
                <Profil changeActivePopup={changeActivePopup} changePopUpContent={changePopUpContent} />
                <RoomsList />
              </React.Fragment>
            )}
          </MainWrapper>
        </div>
      </IconContext.Provider>
    </ThemeProvider>
  );
}

export default App;
