import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const API = "https://ISI-LINK-RAILWAY";

export default function App() {
  const [balance, setBalance] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [effects, setEffects] = useState([]);

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
    setEffects([...effects, {id, x:e.clientX, y:e.clientY}]);

    setTimeout(()=>{
      setEffects(prev=>prev.filter(i=>i.id!==id));
    },800);
  };

  return (
    <div style={{
      background:"#05070d",
      height:"100vh",
      color:"#fff",
      textAlign:"center"
    }}>

      <h1>{balance}</h1>

      <div style={{
        width:"80%",
        margin:"auto",
        height:"10px",
        background:"#222"
      }}>
        <div style={{
          width:energy+"%",
          height:"100%",
          background:"#00f2ff"
        }}/>
      </div>

      <motion.div
        whileTap={{scale:0.9}}
        onClick={tap}
        style={{
          margin:"60px auto",
          width:"180px",
          height:"180px",
          borderRadius:"50%",
          background:"radial-gradient(circle,#00f2ff,#2563eb)",
          boxShadow:"0 0 40px #00f2ff"
        }}
      />

      {effects.map(e=>(
        <motion.div
          key={e.id}
          initial={{opacity:1,y:0}}
          animate={{opacity:0,y:-80}}
          style={{
            position:"absolute",
            left:e.x,
            top:e.y
          }}
        >
          +1
        </motion.div>
      ))}

    </div>
  );
}
