import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://mining-production-ad0d.up.railway.app/"; // ganti

export default function App() {
  const [balance, setBalance] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [rate, setRate] = useState(0);

  const user_id = 1;

  const sync = async () => {
    const res = await axios.post(API + "/sync", { user_id });
    setBalance(res.data.balance);
    setEnergy(res.data.energy);
    setRate(res.data.rate);
  };

  const boost = async () => {
    await axios.post(API + "/boost", { user_id });
  };

  useEffect(() => {
    sync();
    const i = setInterval(sync, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="app">
      <div className="top">
        <div>Miner</div>
        <div>ONLINE</div>
      </div>

      <div className="balance">{balance}</div>
      <div className="rate">+{rate}/s</div>

      <div className="card">
        <div className="energy">
          <div
            className="energy-fill"
            style={{ width: energy + "%" }}
          />
        </div>

        <button className="btn" onClick={boost}>
          ⚡ Boost
        </button>
      </div>
    </div>
  );
          }
