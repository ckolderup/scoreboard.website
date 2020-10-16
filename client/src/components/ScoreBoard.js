import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PlayerDisplay from "./PlayerDisplay.js";
import {
  connectSocket,
  disconnectSocket,
  listenForChanges
} from "../lib/socket.js";

import "./ScoreBoard.css";

export default function ScoreBoard() {
  let { roomId } = useParams();

  const [players, setPlayers] = useState([]);
  const [room, setRoom] = useState(roomId);

  useEffect(() => {
    if (room)
      connectSocket(`${room}-board`, (err, data) => {
        if (err) {
          console.log(err);
          return;
        }
        if (data) {
          data.sort((a, b) => a.score - b.score);
          setPlayers(data || []);
        }
      });

    listenForChanges((err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      data.sort((a, b) => a.score - b.score);
      setPlayers(data || []);
    });

    return () => {
      disconnectSocket();
    };
  }, [room]);

  return (
    <div className="scoreboard">
      <h1>Scores</h1>
      <div className="scores">
        {players.map((player) => (
          <PlayerDisplay
            key={player.name}
            name={player.name}
            score={player.score}
          />
        ))}
      </div>
    </div>
  );
}
