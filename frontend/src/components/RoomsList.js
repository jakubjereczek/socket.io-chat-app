import React, { useState, useEffect } from 'react';
import { ListWrapper, ListElement } from './RoomsList.css';
import { Title, Button, TitleBold, TitleThin } from './Styles.css'

import { FaCalendarTimes, FaChalkboardTeacher, FaCog } from 'react-icons/fa';

const RoomsList = () => {

    // to do: fetch z servera
    const ListElements = null;

    return (
        <React.Fragment>
            <ListWrapper>
                <ListElement>
                    <div>
                        <TitleBold>Room #1</TitleBold>
                        <Title small>We're playing video game chat.</Title>
                    </div>
                    <div>
                        <TitleThin small><span><FaCalendarTimes /> Created: 06.02 15:02</span></TitleThin>
                        <TitleThin small><span><FaChalkboardTeacher /> Online: 3</span></TitleThin>
                        <TitleThin small><span><FaCog /> Password: yes</span></TitleThin>
                        <Button gray small>Join to channel</Button>
                    </div>
                </ListElement>
                <ListElement>
                    <div>
                        <TitleBold>Room #1</TitleBold>
                        <Title small>We're playing video game chat.</Title>
                    </div>
                    <div>
                        <TitleThin small><span><FaCalendarTimes /> Created: 06.02 15:02</span></TitleThin>
                        <TitleThin small><span><FaChalkboardTeacher /> Online: 3</span></TitleThin>
                        <TitleThin small><span><FaCog /> Password: yes</span></TitleThin>
                        <Button gray small>Join to channel</Button>
                    </div>
                </ListElement>
                <ListElement>
                    <div>
                        <TitleBold>Room #1</TitleBold>
                        <Title small>We're playing video game chat.</Title>
                    </div>
                    <div>
                        <TitleThin small><span><FaCalendarTimes /> Created: 06.02 15:02</span></TitleThin>
                        <TitleThin small><span><FaChalkboardTeacher /> Online: 3</span></TitleThin>
                        <TitleThin small><span><FaCog /> Password: yes</span></TitleThin>
                        <Button gray small>Join to channel</Button>
                    </div>
                </ListElement>
                <ListElement>
                    <div>
                        <TitleBold>Room #1</TitleBold>
                        <Title small>We're playing video game chat.</Title>
                    </div>
                    <div>
                        <TitleThin small><span><FaCalendarTimes /> Created: 06.02 15:02</span></TitleThin>
                        <TitleThin small><span><FaChalkboardTeacher /> Online: 3</span></TitleThin>
                        <TitleThin small><span><FaCog /> Password: yes</span></TitleThin>
                        <Button gray small>Join to channel</Button>
                    </div>
                </ListElement>
                <ListElement>
                    <div>
                        <TitleBold>Room #1</TitleBold>
                        <Title small>We're playing video game chat.</Title>
                    </div>
                    <div>
                        <TitleThin small><span><FaCalendarTimes /> Created: 06.02 15:02</span></TitleThin>
                        <TitleThin small><span><FaChalkboardTeacher /> Online: 3</span></TitleThin>
                        <TitleThin small><span><FaCog /> Password: yes</span></TitleThin>
                        <Button gray small>Join to channel</Button>
                    </div>
                </ListElement>
            </ListWrapper>
        </React.Fragment >
    );
}

export default RoomsList;