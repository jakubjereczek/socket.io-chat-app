import './App.css';
import React from 'react';
// import { io } from "socket.io-client";
import { ThemeProvider } from "styled-components";

import Colors from './utils/colors';
import { GlobalStyle } from './utils/globalStyles.js'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MainWrapper } from './components/Styles.css'

import { Name, Profil, RoomsList } from './components';

import { useSocket } from './contexts/SocketContext';

toast.configure();

function App() {

  const socketContext = useSocket();
  const user = socketContext.user;

  console.log('socketContext.user', socketContext.user);

  return (
    <ThemeProvider theme={Colors}>
      <div class="app">
        <GlobalStyle />
        {!user && <Name />}
        <MainWrapper>
          {user && (
            <React.Fragment>
              <Profil />
              <RoomsList />
            </React.Fragment>
          )}
        </MainWrapper>
      </div>
    </ThemeProvider>
  );
}

export default App;
