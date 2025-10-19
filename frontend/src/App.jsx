import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const COINS = ["BTCUSDT", "ETHUSDT", "DOGEUSDT"];

function App() {
  const [data, setData] = useState({});
  const [selected, setSelected] = useState("BTCUSDT");

  console.log('inside App ....')
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:9000");
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const { symbol, price } = msg;

      setData((prev) => {
        const arr = prev[symbol] || [];
        return {
          ...prev,
          [symbol]: [...arr.slice(-49), { time: new Date().toLocaleTimeString(), price }],
        };
      });
    };
    return () => ws.close();
  }, []);

  const currentData = data[selected] || [];
  const latestPrice = currentData.length ? currentData.at(-1).price : null;

  return (
    
    <div style={{ background: "#0f172a", color: "white", minHeight: "100vh", padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>💹 Real-Time Crypto Dashboard</h1>
      <p>'Hello from App! ...'</p>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        {COINS.map((coin) => (
          <button
            key={coin}
            onClick={() => setSelected(coin)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
              background: selected === coin ? "#10b981" : "#334155",
              color: "white",
            }}
          >
            {coin.replace("USDT", "")}
          </button>
        ))}
      </div>

      <h2 style={{ marginBottom: "1rem" }}>
        {selected}:{" "}
        <span style={{ color: "#22d3ee" }}>
          {latestPrice ? `$${latestPrice.toFixed(4)}` : "Loading..."}
        </span>
      </h2>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={currentData}>
          <XAxis dataKey="time" hide />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default App;