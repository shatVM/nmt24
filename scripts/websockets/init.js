import * as importConfig from "../dev/config.js";

const WS_API_URL = importConfig.ws_api_url;

const initWs = () => {
    const ws = new WebSocket("ws://localhost:5060");
    console.log(ws)

    ws.onopen = () => {
        console.log('WebSocket connection established');
        console.log(ws)
        // ws.send("peremoga");
        console.log("peremoga");
    };
    
    ws.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        console.log('Received message:', message);
    }
    
    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    ws.sendMessage = (message) => {
        message = JSON.stringify(message);
        ws.send(message);
    }

    return ws;
} 

export { initWs };