import React from "react";
import "./Player.css";

export default function Player({name, score, avi, ...rest}) {
  const delay = Math.floor(Math.random() * 5);

  return (
    <div className="player-display" {...rest}>
      <img className={`player-avatar animated swing delay-${delay}`} src={avi} />
      <h2 className="name">{name}</h2>
      <div className="score">{score}</div>
    </div>
  );
}
