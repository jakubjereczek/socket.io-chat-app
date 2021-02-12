import './App.css';
import React, { useState, useMemo } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

// import { io } from "socket.io-client";
import { ThemeProvider } from "styled-components";
import { IconContext } from "react-icons"

import Colors from './utils/colors';
import { GlobalStyle } from './utils/globalStyles.js'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MainWrapper } from './components/Styles.css'

import { Name, Profil, RoomsList, Popup, Room } from './components';
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
  const changeActivePopup = (bool) => setIsActivePopup(bool);
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
          <Router>
            <Switch>
              <Route exact path="/" >
                {!user && <Name />}
                <MainWrapper>
                  {user && (
                    <React.Fragment>
                      <Profil changeActivePopup={changeActivePopup} changePopUpContent={changePopUpContent} />
                      <RoomsList />
                    </React.Fragment>
                  )}
                </MainWrapper>
              </Route>
              <Route path="/room/:id">
                <MainWrapper>
                  <Room />
                </MainWrapper>
              </Route>
              <Route>
                {/* to do */}
                Not found
              </Route>
            </Switch>
          </Router>
        </div>
      </IconContext.Provider>
    </ThemeProvider>
  );
}

export default App;
