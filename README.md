# socket.io-chat-app 
Chat app using React.js and socket.io.

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Demo](#demo)
* [Screenshots](#screenshots)


## General info
Chat application with rooms. 

The room can be made public and private (protected by a password).
The user's account is temporary - it will be deleted when the user closes the browser tab.
The application displays a notification in real time that the user is writing a message and, if it is sent, refreshes all users messages list present on the channel. If the room is empty - it is automatically deleted.

## Technologies
#### Client
- react framework 16.8^,
- socket.io client,
- react router,
- react icons,
- toastify,
- styled-components

#### Server
- node.js,
- express.js,
- socket.io

## Demo
https://socketio-chat-app-client.herokuapp.com/

## Screenshots
A some screenshots from app
![Room list](./screenshot1.png)
![Chat desktop view](./screenshot2.png)
