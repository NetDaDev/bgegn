import { parentPort } from "node:worker_threads";
import config from "../config.js";
import { WebSocket } from "ws";
import axios from "axios";
import ProxyAgent from "proxy-agent";

console.log("Loading default...");

const url =
    "https://raw.githubusercontent.com/themiralay/Proxy-List-World/master/data.txt";

let proxyList = [];

const fetchProxies = async () => {
    try {
        const response = await axios.get(url);
        const data = response.data;
        proxyList = data
            .split(/\r?\n/)
            .filter((proxy) => proxy.trim() !== "")
            .map((proxy) => proxy.replace(/\r$/, ""));
        console.log("Proxies fetched:", proxyList.length);
    } catch (error) {
        console.error(`Error fetching proxies: ${error}`);
    }
};

fetchProxies();

const getRandomProxy = () => {
    if (proxyList.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * proxyList.length);
    return proxyList[randomIndex];
};

var isStartedBots = false;

class Bot {
    constructor(socketUrl) {
        this.socketUrl = socketUrl;
        this.initBot();
    }

    initBot() {
        this.botName =
            config.botNames[Math.floor(Math.random() * config.botNames.length)];
        this.isReconnecting = false;
        this.connect();
    }

    connect() {
        const randProxy = getRandomProxy();
        this.randomProxy = new ProxyAgent(`${config.proxyType}://${randProxy}`);
        this.socket = new WebSocket(this.socketUrl, {
            headers: {
                Pragma: "no-cache",
                "Cache-Control": "no-cache",
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 OPR/107.0.0.0",
                Origin: "https://agar.cc",
                "Sec-WebSocket-Version": "13",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "en-US,en;q=0.9",
            },
            rejectUnauthorized: false,
            agent: this.randomProxy,
        });

        this.socket.binaryType = "arraybuffer";
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onerror = this.onError.bind(this);
        this.socket.onclose = this.onClose.bind(this);
    }

    reconnect() {
        this.clearIntervals();

        delete this.socket;
        delete this.randomProxy;

        if (this.socketUrl) {
            this.connect();
        }
    }

    disconnect() {
        this.clearIntervals();

        if (this.socket) {
            this.socket.terminate();
            this.socket = null;
        }

        delete this.socket;
        delete this.randomProxy;
    }

    clearIntervals() {
        clearInterval(this.pingInterval);
        clearTimeout(this.spawnInterval);
    }

    Buffer(buf = 1) {
        return new DataView(new ArrayBuffer(buf));
    }

    onOpen() {
        const buffer = new ArrayBuffer(5);
        const writer = new DataView(buffer);
        writer.setUint8(0, 122);
        writer.setUint8(1, 6);
        writer.setUint8(2, 0);
        writer.setUint8(3, 0);
        writer.setUint8(4, 0);
        const arr = new Uint8Array(buffer);

        setInterval(() => {
            this.send(arr);
            this.keybinds();

            var username = this.gd(8);
            var email = this.gd(8 + "@gmail.com");
            var password = this.gd(8);
            const totalLength = 1 + username.length + 1 + email.length + 1 + password.length + 1;
            const buffer = new ArrayBuffer(totalLength);
            const view = new DataView(buffer);

            let offset = 0;


            view.setUint8(offset, 0x99);
            offset += 1;

            function setStringUTF8(view, offset, str) {
                for (let i = 0; i < str.length; i++) {
                    view.setUint8(offset++, str.charCodeAt(i));
                }
                view.setUint8(offset++, 0); // Null terminator
                return offset;
            }
            offset = setStringUTF8(view, offset, username);
            offset = setStringUTF8(view, offset, email);
            offset = setStringUTF8(view, offset, password);
            this.send(buffer);


            const write = new Writer(true);
            write.setUint8(0x99);
            write.setStringUTF8(username);
            write.setStringUTF8(email);
            write.setStringUTF8(password);
            wsSend(write);

            const writerd = new DataView(new ArrayBuffer(2));
            writerd.setUint8(0, 189);
            writerd.setUint8(1, 1);
            this.send(writerd);
        }, 1000 / 59);
        this.sendChat("back");
    }

    keybinds() {
        const tokenenter = new TextEncoder().encode(keyBinds.Space + keyBinds.wKey + keyBinds.qKey + keyBinds.sKey + keyBinds.tKey + keyBinds.nKey + keyBinds.dKey + keyBinds.zKey + keyBinds.cKey + keyBinds.oKey + keyBinds.pKey);
        const tokenscnd = new TextEncoder().encode("asdfghjklqwertyuiop\zxcvbnmqwertyuiopasdfghjklzxcvbnm123456789sadfghjkzxcvbnmz4wxehunijswdetfvgybhnx4erdctfvgybhjns34ed5rctvnhd5rby");
        const messageLength = 3 + tokenenter.length + tokenscnd.length;
        const buffer = new ArrayBuffer(messageLength);
        const view = new DataView(buffer);
        view.setUint8(0, 222); view.setUint8(1, tokenenter.length); for (let i = 0; i < tokenenter.length; i++) { view.setUint8(2 + i, tokenenter[i]); } const tp = 2 + tokenenter.length; view.setUint8(tp, tokenscnd.length); for (let j = 0; j < tokenscnd.length; j++) { view.setUint8(tp + 1 + j, tokenscnd[j]); }
        this.send(buffer);
    }
    sendChat(text) {
        // Calculate buffer size: 2 bytes for the initial Uint8 values + length of the text + 1 for the null terminator
        const bufferSize = 2 + text.length + 1;
        const buffer = new ArrayBuffer(bufferSize);
        const view = new DataView(buffer);

        let offset = 0;

        // Set the Uint8 values
        view.setUint8(offset++, 0x63);
        view.setUint8(offset++, 0);

        // Function to write a string to the DataView with a null terminator
        function setStringUTF8(view, offset, str) {
            for (let i = 0; i < str.length; i++) {
                view.setUint8(offset++, str.charCodeAt(i));
            }
            view.setUint8(offset++, 0); // Null terminator
            return offset;
        }

        // Write the text string
        setStringUTF8(view, offset, text);

        // Send the buffer using wsSend
        this.send(buffer);
    }

    onMessage(data) {

    }

    onError(error) {
        // Implement.
    }

    onClose() {
        this.handleReconnection();
    }

    gd(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let result = '';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charactersLength);
            result += characters.charAt(randomIndex);
        }

        return result;
    }
    handleReconnection() {
        if (!this.isReconnecting) {
            this.isReconnecting = true;
            this.reconnect();
        }
    }

    spawn() {
        // Implement.
    }

    split() {
        this.sendUint8(17);
    }

    eject() {
        this.sendUint8(21);
    }

    sendMove(x, y) {
        // Implement.
    }

    sendChat(message) {
        // Implement.
    }

    sendUint8(offset) {
        const onebyte = new DataView(new ArrayBuffer(1));
        onebyte.setUint8(0, offset);
        this.send(onebyte);
    }

    get onopen() {
        return this.socket && this.socket.readyState === WebSocket.OPEN;
    }

    send(data) {
        if (this.onopen) {
            this.socket.send(data.buffer);
        }
    }
}

const bots = [];

const sendOpenConnectionsUpdate = () => {
    const openBots = bots.filter(
        (bot) => bot.socket && bot.socket.readyState === WebSocket.OPEN,
    );

    parentPort.postMessage(
        JSON.stringify({
            type: "openConnectionsUpdate",
            count: openBots.length,
            max: config.max,
        }),
    );
};

const updateInterval = setInterval(sendOpenConnectionsUpdate, 500);

parentPort.on("message", (message) => {
    const msg = JSON.parse(message);
    switch (msg.type) {
        case "startBots":
            if (!isStartedBots) {
                const socketUrl = msg.url;
                for (let i = 0; i < config.max; i++) {
                    bots.push(new Bot(socketUrl));
                }
                isStartedBots = true;
            }
            break;
        case "stopBots":
            bots.forEach((bot) => bot.disconnect());
            bots.length = 0;
            isStartedBots = false;
            break;
        case "splitBots":
            bots.forEach((bot) => bot.split());
            break;
        case "ejectBots":
            bots.forEach((bot) => bot.eject());
            break;
        case "mousePos":
            const { x, y } = msg.coords;
            bots.forEach((bot) => bot.sendMove(x, y));
            break;
        case "chatBots":
            bots.forEach((bot) => bot.sendChat(msg.message));
            break;
    }
});