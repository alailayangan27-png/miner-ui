import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const API = "https://mining-production-ad0d.up.railway.app/";

export default function App() {
  const [balance, setBalance] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [clicks, setClicks] = useState([]);

  const user_id = "user1";

  useEffect(() => {
    const i = setInterval(() => {
      fetch(API + "/sync", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({user_id})
      })
      .then(r=>r.json())
      .then(d=>{
        setBalance(d.balance);
        setEnergy(d.energy);
      });
    }, 1000);

    return ()=>clearInterval(i);
  }, []);

  const tap = (e) => {
    fetch(API + "/tap", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({user_id})
    });

    const id = Date.now();
    const x = e.clientX;
    const y = e.clientY;

    setClicks((c)=>[...c,{id,x,y}]);

    setTimeout(()=>{
      setClicks((c)=>c.filter(i=>i.id!==id));
    },1000);
  };

  return (
    <div style={{
      background:"#0b0f1a",
      color:"#fff",
      height:"100vh",
      textAlign:"center",
      paddingTop:"40px"
    }}>
      
      <h2>{balance}</h2>

      {/* ENERGY BAR */}
      <div style={{
        width:"80%",
        margin:"auto",
        height:"10px",
        background:"#222",
        borderRadius:"10px"
      }}>
        <div style={{
          width:energy+"%",
          height:"100%",
          background:"#00f2ff"
        }}/>
      </div>

      {/* TAP AREA */}
      <motion.div
        onClick={tap}
        whileTap={{ scale: 0.9 }}
        style={{
          margin:"60px auto",
          width:"180px",
          height:"180px",
          borderRadius:"50%",
          background:"radial-gradient(circle,#00f2ff,#1d4ed8)",
          boxShadow:"0 0 40px #00f2ff",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          fontSize:"24px"
        }}
      >
        ⛏
      </motion.div>

      {/* FLOATING TEXT */}
      {clicks.map(c => (
        <motion.div
          key={c.id}
          initial={{ opacity:1, y:0 }}
          animate={{ opacity:0, y:-80 }}
          transition={{ duration:1 }}
          style={{
            position:"absolute",
            left:c.x,
            top:c.y,
            color:"#00f2ff"
          }}
        >
          +1
        </motion.div>
      ))}

    </div>
  );
            }
