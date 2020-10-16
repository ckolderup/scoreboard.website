import React, { useEffect, useState } from "react";
import "./PlayerDisplay.css";

export default function PlayerDisplay({name, score}) {
  return (
    <div className="player">
      <h2 className="name">{name}</h2>
      <div className="score">{score}</div>
    </div>
  );
}
