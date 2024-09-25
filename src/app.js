import { Render, serveStaticFile, colorLog } from "./render";
import { db } from "./api/db";

const server = Bun.serve({
    async fetch(req, server) {
        if (req.method == "GET") {
            let path = new URL(req.url).pathname;
            if (path.includes("websocket")) {
                if (server.upgrade(req)) {
                    console.log("Upgraded to websocket");
                    return;
                } else {
                    console.log("Failed to upgrade to websocket");
                }
            }
            colorLog(path);
            if (!path.includes(".") && !path.includes("websocket")) {
                return Render(path);
            }
            return await serveStaticFile(path);
        } else if (req.method == "POST") {
        }
        return new Response("Not Found", { status: 404 });
    },
    websocket: {
        async message(ws, message) {
            //console.log("Received message: ", message);
            try {
                message = JSON.parse(message);
            } catch (error) {
                console.log("Error parsing message: ", error);
                return; 
            } 
            if (message.type === "signup") {
                try {
                    const userCreation = await db.studentCreate(message.data);
                    //console.log(userCreation);
                    if (!userCreation[0]) {
                        ws.send(
                            JSON.stringify({
                                title: "Error",
                                message: userCreation[1],
                            })
                        );
                        return;
                    }
                    console.log("Created student: ", message.data);
                    ws.send( 
                        JSON.stringify({
                            title: "Success",
                            message: "Student created successfully",
                        })
                    );
                } catch (error) {
                    console.log("Error creating student: ", error);
                    ws.send(
                        JSON.stringify({
                            title: "Error",
                            message: "Error creating student",
                        })
                    );
                }
            }
        },
        open(ws) {
            console.log("Opened websocket");
        },
    },
});

console.log(`Listening on ${server.hostname}:${server.port}`);
