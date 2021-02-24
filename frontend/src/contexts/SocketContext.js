import React, { useContext, useState, useEffect } from 'react';

import { io } from "socket.io-client";

// to do tokeny w localStorage
const token = null;
const refreshToken = "tokena tokenb"


const SocketContext = React.createContext(undefined);

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({ children }) => {

    const options = {
        withCredentials: true,
        transports: ['websocket', 'polling', 'flashsocket'],

        query: { token, refreshToken }
    };

    const [socket, setSocket] = useState();
    const [user, setUser] = useState();

    useEffect(() => {
        const socket = io("http://127.0.0.1:80", options);
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