import './App.css';
import React from 'react';
// import { io } from "socket.io-client";
import { ThemeProvider } from "styled-components";

import Colors from './utils/colors';
import { GlobalStyle } from './utils/globalStyles.js'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Name } from './components';

import { useSocket } from './contexts/SocketContext';

toast.configure();

function App() {

  const socketContext = useSocket();
  const user = socketContext.user;

  return (
    <ThemeProvider theme={Colors}>
      <GlobalStyle />
      {!user && <Name />}

      <div className="App">
        Hello world
        </div>
    </ThemeProvider>
  );
}

export default App;
