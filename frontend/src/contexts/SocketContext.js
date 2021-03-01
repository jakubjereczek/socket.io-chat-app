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
        const socket = io("https://socketio-chat-appserver.herokuapp.com", options);
        console.log(socket);
        setSocket(socket);

        return () => socket.disconnect();
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