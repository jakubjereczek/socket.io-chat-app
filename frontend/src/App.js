import './App.css';
import React, { useEffect } from 'react';
import { io } from "socket.io-client";

function App() {
  // dla tej samej domeny
  //const socket = io();

  // dla innej domeny niz serwer
  const options = {
    withCredentials: true,
    transports: ['websocket', 'polling', 'flashsocket']
  };

  useEffect(() => {
    const socket = io("http://127.0.0.1:80", options);

    socket.emit('message from client', "message od klienta do serwera");

    socket.on('message from server', (msg) => {
      console.log('msg', msg);
    })

  })

  return (
    <div className="App">
      Hello world
    </div>
  );
}

export default App;
