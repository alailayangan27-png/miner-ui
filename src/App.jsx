import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const API = "https://mining-production-ad0d.up.railway.app";

export default function App() {
  const [balance, setBalance] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [clicks, setClicks] = useState([]);

  const user_id = "user1";

  useEffect(() => {
    const i = setInterval(() => {
      fetch(API + "/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id })
      })
        .then(r => r.json())
        .then(d => {
          setBalance(d.balance);
          setEnergy(d.energy);
        });
    }, 1000);

    return () => clearInterval(i);
  }, []);

  const tap = (e) => {
    fetch(API + "/tap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id })
    });

    const id = Date.now();
    const x = e.clientX;
    const y = e.clientY;

    setClicks([...clicks, { id, x, y }]);

    setTimeout(() => {
      setClicks((prev) => prev.filter((c) => c.id !== id));
    }, 800);
  };

  return (
    <div style={styles.container}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={{opacity:0.6}}>Mining Balance</h2>
        <h1 style={styles.balance}>{balance.toFixed(3)}</h1>
      </div>

      {/* ENERGY BAR */}
      <div style={styles.energyBox}>
        <div style={styles.energyBg}>
          <motion.div
            animate={{ width: energy + "%" }}
            style={styles.energyFill}
          />
        </div>
        <span style={{opacity:0.6}}>Energy {energy}%</span>
      </div>

      {/* MINING BUTTON */}
      <motion.div
        whileTap={{ scale: 0.85 }}
        onClick={tap}
        style={styles.coin}
      />

      {/* FLOATING EFFECT */}
      {clicks.map((c) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{ opacity: 0, y: -100, scale: 1.5 }}
          transition={{ duration: 0.8 }}
          style={{
            position: "absolute",
            left: c.x,
            top: c.y,
            color: "#00f2ff",
            fontWeight: "bold"
          }}
        >
          +1
        </motion.div>
      ))}

    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "radial-gradient(circle at top, #0f172a, #020617)",
    color: "#fff",
    textAlign: "center",
    fontFamily: "sans-serif",
    overflow: "hidden"
  },
  header: {
    paddingTop: "40px"
  },
  balance: {
    fontSize: "40px",
    background: "linear-gradient(90deg,#00f2ff,#2563eb)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  energyBox: {
    marginTop: "20px"
  },
  energyBg: {
    width: "80%",
    margin: "auto",
    height: "12px",
    background: "#111",
    borderRadius: "10px",
    overflow: "hidden"
  },
  energyFill: {
    height: "100%",
    background: "linear-gradient(90deg,#00f2ff,#2563eb)"
  },
  coin: {
    margin: "80px auto",
    width: "180px",
    height: "180px",
    borderRadius: "50%",
    background: "radial-gradient(circle,#00f2ff,#2563eb)",
    boxShadow: "0 0 60px #00f2ff, inset 0 0 20px #fff",
    cursor: "pointer"
  }
};
