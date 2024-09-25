//add a websocket message handler

import { server } from "typescript";

server.websocket = {
    async message(ws, message) {
        console.log(`Received ${message}`);
        // send back a message
        ws.send(`You said: ${message}`);
    },
    };