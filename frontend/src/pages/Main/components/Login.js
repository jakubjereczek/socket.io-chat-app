import React, { useState, useEffect } from 'react';
import { TitleBold, TitleThin, Title, Input, Button } from 'components/Styles.css'

import { useSocket } from 'contexts/SocketContext';
import { useGeneratorColor, useLocalStorage } from 'hooks';

import { useAuth } from 'contexts/AuthContext';

const Login = () => {

    const socketContext = useSocket();
    const auth = useAuth();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const buttonHandler = () => auth.login(name, password);

    // inaczej pobrac name
    const inputHandler = (e, name) => {
        const value = e.target.value;

        switch (name) {
            case "name":
                setName(value)
                break;
            case "password":
                setPassword(value)
                break;
        }
    }

    const InputsContainer = (
        <React.Fragment>
            <Input value={name} onChange={(e) => inputHandler(e, "name")} />
            <Input value={password} onChange={(e) => inputHandler(e, "password")} />
        </React.Fragment>
    );

    return (
        <React.Fragment>
            {InputsContainer}
            <Button onClick={buttonHandler}>Join</Button>
        </React.Fragment>
    )
}
export default Login;