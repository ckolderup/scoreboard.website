import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Player from "./Player.js";
import AddPlayer from  "./AddPlayer.js";
import { connectSocket, disconnectSocket, listenForChanges, sendScores } from "../lib/socket.js";

import "./ScoreEditor.css";
import Random from "../lib/random.js";

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

  function postToScoreboard() {
    fetch(`/api/scores/${room}`, {
      method: 'post',
      body: JSON.stringify(players)
    }).then(res => res.json())
    .then((data) => { })
    .catch((e) => {
      console.log(e);
    })
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max-min) + min);
  }

  function shuffleScores() {

    players.forEach((p) => {
      p.score = randomInt(0, 25);
    });
    pushPlayers(players);
    postToScoreboard();
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

  function randomizeAvatar(name) {
    const player = players.find(p => p.name === name)

    if (player !== undefined) {
      player.avi = `http://www.avatarpro.biz/avatar/${Random.generateHash()}?s=150`;
      pushPlayers(players);
    }
  }

  function openView() {
    window.open(`/room/${room}`, '_blank');
  }

  return (
    <div className="scoreboard">
      <h1>Scores</h1>
      <div className="score-edits">
        {players.map((player) => (
          <Player
            key={player.name}
            removePlayer={() => removePlayer(player.name)}
            name={player.name}
            avi={player.avi}
            startScore={player.score}
            setScore={(score) => setScore(player.name, score)}
            setAvatar={() => randomizeAvatar(player.name)}
          />
        ))}
      </div>
      <AddPlayer players={players} onSubmit={handleSubmit} />

      <div className="actions">
        <button onClick={postToScoreboard}>Update</button>
        <button onClick={shuffleScores}>Shuffle</button>
        <button onClick={openView}>View</button>
      </div>
    </div>
  );
}
