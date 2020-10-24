import React from 'react';
import "./Player.css";

export default function Player({name, startScore, avi, setScore, setAvatar, removePlayer}) {
  return (
    <div className="player">
      <button className="trash-button" onClick={removePlayer}>
        ❌
      </button>
      <img className="edit-avatar" onClick={setAvatar} src={avi}/>
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
