import React, { useEffect, useState } from 'react';
import "./Player.css";

export default function Player({name, startScore, setScore, removePlayer}) {  
  return (
    <div className="player">
      <button className="trash-button" onClick={removePlayer}>
        ❌
      </button>
      <h2 className="name">{name}</h2>
      <input 
        type="number"
        className="score"
        onChange={e => setScore(e.target.value)}
        value={startScore}
      />  
    </div>
  );
}
