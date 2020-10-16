import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Player from "./Player.js";
import AddPlayer from  "./AddPlayer.js";
import { connectSocket, disconnectSocket, listenForChanges, sendScores } from "../lib/socket.js";

import "./ScoreEditor.css";

export default function ScoreEditor() {
	let { roomId } = useParams();

  const [players, setPlayers] = useState([]);
  const [room, setRoom] = useState(roomId);

  useEffect(() => {
    if (room) connectSocket(room, (err, data) => {
      if (err) return;

      setPlayers(data || []);
    });

    listenForChanges((err, data) => {
      if (err) return;

      setPlayers(data || []);
    });

    return () => {
      disconnectSocket();
    }
  }, [room]);

  function pushPlayers(newPlayers) {
    sendScores(room, newPlayers);
  }

  function postToScoreboard(e) {
    e.preventDefault();
    
    fetch(`/api/scores/${room}`, {
      method: 'post',
      body: JSON.stringify(players)
    }).then(res => res.json())
    .then((data) => { })
    .catch((e) => {
      console.log(e);
    })
  }
  
  function handleSubmit(newPlayer) {
    pushPlayers([...players, newPlayer]);
  }

  function removePlayer(name) {    
    sendScores(room, players.filter(p => p.name !== name));
  }
  
  function setScore(name, score) {
    const player = players.find(p => p.name === name)
    
    if (player !== undefined) {
      player.score = score;
      pushPlayers(players);
    }
  }

  return (
    <div className="scoreboard">
      <h1>Scores</h1>
      <div className="scores">
        {players.map((player) => (
          <Player
            key={player.name}
            removePlayer={() => removePlayer(player.name)}
            name={player.name}
            startScore={player.score}
            setScore={score => setScore(player.name, score)}
          />
        ))}
      </div>
      <AddPlayer players={players} onSubmit={handleSubmit} />
      
      <form className="push-updates" target="_blank" onSubmit={postToScoreboard}>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
