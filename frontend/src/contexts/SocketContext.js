import React, { useContext, useState, useEffect } from 'react';

import { io } from "socket.io-client";

const SocketContext = React.createContext(undefined);

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({ children }) => {

    const options = {
        withCredentials: true,
        transports: ['websocket', 'polling', 'flashsocket']
    };

    const [socket, setSocket] = useState();
    const [user, setUser] = useState();

    useEffect(() => {
        const socket = io("http://127.0.0.1:80", options);
        console.log(socket);
        setSocket(socket);

        // socket.emit('message from client', "message od klienta do serwera");

        // socket.on('message from server', (msg) => {
        //     console.log('msg', msg);
        // })
    }, []);

    const values = {
        socket,
        user,
        setUser
    }


    return (
        <SocketContext.Provider value={values}>
            {socket && children}
        </SocketContext.Provider>
    );
}