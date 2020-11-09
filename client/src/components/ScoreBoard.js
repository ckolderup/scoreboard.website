import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Flipper, Flipped } from "react-flip-toolkit";
import Player from "./Player.js";
import {
  connectSocket,
  disconnectSocket,
  listenForChanges
} from "../lib/socket.js";


import "./ScoreBoard.css";

export default function ScoreBoard() {
  let { roomId } = useParams();

  const [players, setPlayers] = useState([]);
  const [room] = useState(roomId);

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
      <Flipper spring="gentle" staggerConfig={{speed: .5}} className="scores" flipKey={players.map((x) => x.name).join("")}>
        {players.map((player) => (
          <Flipped key={player.name} flipId={player.name}>
            <Player {...player} />
          </Flipped>
        ))}
      </Flipper>
    </div>
  );
}
