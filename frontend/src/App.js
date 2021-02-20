import './App.css';
import React, { useState, useMemo } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import { ThemeProvider } from "styled-components";
import { IconContext } from "react-icons"

import Colors from './utils/colors';
import { GlobalStyle } from './utils/globalStyles.js'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MainWrapper } from './components/Styles.css'

import { Popup } from './components';
import { Room, Main, NotFound } from './pages';

toast.configure();

function App() {


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
                <Main changeActivePopup={changeActivePopup} changePopUpContent={changePopUpContent} />
              </Route>
              <Route path="/room/:id">
                <MainWrapper>
                  <Room />
                </MainWrapper>
              </Route>
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </Router>
        </div>
      </IconContext.Provider>
    </ThemeProvider>
  );
}

export default App;
