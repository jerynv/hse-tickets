import { Render,  serveStaticFile, colorLog } from "./render"

const server = Bun.serve({
    async fetch(req, server) {
      let path = new URL(req.url).pathname;
      const success = server.upgrade(req);
      if (success) {
        // Bun automatically returns a 101 Switching Protocols
        // if the upgrade succeeds
        return undefined;
      }
  
      if (path === "/") {
        return Render("home");
      }
      return await serveStaticFile(path);
    },
    websocket: {
      // this is called when a message is received
      async message(ws, message) {
        console.log(`Received ${message}`);
        // send back a message
        ws.send(`You said: ${message}`);
      },
    },
  });
  
console.log(`Listening on ${server.hostname}:${server.port}`);