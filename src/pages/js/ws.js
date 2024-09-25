export let ws = new WebSocket("ws://localhost:3000/websocket");

ws.onopen = function () {
    console.log("Connected to the server");
};

ws.onclose = function () {
    console.log("Disconnected from the server");
};

export async function signup(data) {
    if (ws.readyState !== ws.OPEN) {
        ws = null;
        ws = new WebSocket("ws://localhost:3000/websocket");
        loader(10, 1);
        await new Promise((resolve) => {
            loader(10, 3)
            ws.onopen = function () {
                loader(10, 10);
                resolve();
            };
        });
    }
    // Send the data over the websocket and wait for a response
    ws.send(JSON.stringify({ type: "signup", data: data }));
    loader(10, 1);
    const response = await new Promise((resolve, reject) => {
        loader(10, 3);
        ws.onmessage = function (event) {
            loader(10, 10);
            resolve(JSON.parse(event.data));
        };
    });
    return response;
}

export function loader(notches, current) {
    var span = 0;
    if (current == 1) {
        var span = document.createElement("span");
        span.classList.add("fake-loader");
        document.body.appendChild(span);
    } else {
        span = $(".fake-loader");
        //console.log(span);
    }
    // Trigger the animation after appending to ensure it starts from left: 0
    setTimeout(function () {
        $(span).css("width", (current / notches) * 100 + "%");
    }, 100); // A slight delay to ensure the CSS is applied

    //fade out the span after the animation duration
    if (current == notches) {
        setTimeout(function () {
            $(span).css("opacity", "0");
        }, 1100); // Slightly longer than the CSS animation to ensure it completes

        // Remove the span after the animation duration
        setTimeout(function () {
            $(span).remove();
        }, 2100); // Slightly longer than the CSS animation to ensure it completes
    }
}
