import express from "express";
import { WebSocketServer } from "ws";
import WebSocket from "ws";

const app = express();
const PORT = 9000;

const server = app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });

const SYMBOLS = ["btcusdt", "ethusdt", "dogeusdt"];
const BINANCE_URL = `wss://stream.binance.com:9443/stream?streams=${SYMBOLS.map(
  (s) => `${s}@trade`
).join("/")}`;

const binanceWS = new WebSocket(BINANCE_URL);

binanceWS.on("open", () => console.log("📡 Connected to Binance stream"));
binanceWS.on("message", (msg) => {
  const data = JSON.parse(msg);
  const payload = data.data;
  if (!payload || !payload.s || !payload.p) return;

  const event = { symbol: payload.s, price: parseFloat(payload.p) };

  // Broadcast to all frontend clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(event));
    }
  });
});

wss.on("connection", () => console.log("🧩 Frontend connected"));
