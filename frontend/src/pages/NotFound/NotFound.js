import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

import { Wrapper } from './NotFound.css';
import { TitleBold, TitleThin } from 'components/Styles.css';

const NotFound = () => {

    const history = useHistory();

    const [delayTime, setDelayTime] = useState(5); // 5 sek
    const [timer, setTimer] = useState(undefined);

    function timerHandler() {
        setTimer(setTimeout(() => {
            setDelayTime(prev => prev - 1);
            timerHandler();
        }, 1000));

        return () => {
            clearTimeout(timer)
        }
    }

    useEffect(timerHandler, [])

    useEffect(() => {
        if (delayTime === 0) {
            // przejscie do strony glownej
            history.push("/")
        }
    }, [delayTime])

    return (
        <Wrapper>
            <div>
                <TitleBold>Page is not found <span>404</span></TitleBold>
            </div>
            <div>
                <TitleThin small>You'll be move in {delayTime} seconds to main page.</TitleThin>
            </div>
        </Wrapper>
    );
}

export default NotFound;