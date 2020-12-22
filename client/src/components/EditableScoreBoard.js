import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SketchPicker } from 'react-color';
import EditablePlayer from "./EditablePlayer.js";
import AddPlayer from "./AddPlayer.js";
import { connectSocket, disconnectSocket, listenForChanges, sendChanges } from "../lib/socket.js";
import { createGlobalStyle } from "styled-components";
import patterns from '../lib/heropatterns';

import "./EditableScoreBoard.css";

// LMAOOOOOOOOOOO
Number.prototype.mod = function (n) {
  return ((this % n) + n) % n;
};

function pickFontColor(rgb) {
  const yiq = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return (yiq >= 128) ? 'black' : 'white'
}

const GlobalStyle = createGlobalStyle`
  body {
    ${(props) => `
      background-image: url(/hero-patterns/${props.pageStyle.backgroundImage.filename});
      background-color: ${props.pageStyle ? props.pageStyle.backgroundColor.hex : '#222'} !important;
      color: ${pickFontColor(props.pageStyle ? props.pageStyle.backgroundColor.rgb : '#222')} !important;
    `}
  }
`;

export default function EditableScoreBoard() {

  let { roomId } = useParams();

  const [players, setPlayers] = useState([]);
  const [room] = useState(roomId);
  const [pageStyle, setPageStyle] = useState({
    backgroundColor: { hex: '#222', rgb: { 'r': 34, 'g': 34, 'b': 34 } },
    backgroundImage: { index: 0, filename: patterns[0] },
  });

  useEffect(() => {
    if (room) connectSocket(room, (err, data) => {
      if (err) return;

      setPlayers(data ? data.players || [] : players);
      setPageStyle(data ? data.pageStyle || {} : pageStyle);
    });

    listenForChanges((err, data) => {
      if (err) return;

      setPlayers(data ? data.players || [] : players);
      setPageStyle(data ? data.pageStyle || {} : pageStyle);
    }, 'change');

    return () => {
      disconnectSocket();
    }
  }, [pageStyle, room]);

  function pushPlayers(newPlayers) {
    sendChanges(room, newPlayers, pageStyle);
  }

  function updateServer() {
    fetch(`/api/state/${room}`, {
      method: 'post',
      body: JSON.stringify({ players: players, pageStyle: pageStyle })
    }).then(res => res.json())
      .catch((e) => {
        console.log(e);
      })
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function shuffleScores() {

    players.forEach((p) => {
      p.score = randomInt(0, 25);
    });
    pushPlayers(players);
    updateServer();
  }

  function nextBackgroundPattern(e) {
    e.preventDefault();
    const newIndex = (pageStyle.backgroundImage.index + 1).mod(patterns.length);
    sendChanges(room, players, {
      ...pageStyle, backgroundImage: {
        index: newIndex,
        filename: patterns[newIndex]
      }
    });
  }

  function previousBackgroundPattern(e) {
    e.preventDefault();
    const newIndex = (pageStyle.backgroundImage.index - 1).mod(patterns.length);
    sendChanges(room, players, {
      ...pageStyle, backgroundImage: {
        index: newIndex,
        filename: patterns[newIndex]
      }
    });
  }

  function clearBackgroundPattern(e) {
    e.preventDefault();

    sendChanges(room, players, { ...pageStyle, backgroundImage: { index: 0, filename: patterns[0] } });
  }

  function handleSubmit(newPlayer) {
    pushPlayers([...players, newPlayer]);
  }

  function removePlayer(name) {
    sendChanges(room, players.filter(p => p.name !== name), pageStyle);
  }

  function setScore(name, score) {
    const player = players.find(p => p.name === name)

    if (player !== undefined) {
      player.score = score;
      pushPlayers(players);
    }
  }

  function changeAvatar(name, url) {
    const player = players.find(p => p.name === name)

    if (player !== undefined) {
      player.avi = url;
      pushPlayers(players);
    }
  }

  function changeColor(color) {
    sendChanges(room, players, { ...pageStyle, backgroundColor: color });
  }

  function openView() {
    window.open(`/room/${room}`, '_blank');
  }

  return (
    <div className="scoreboard">
      <h1>Scores</h1>
      <div className="score-edits">
        {players.map((player) => (
          <EditablePlayer
            key={player.name}
            removePlayer={() => removePlayer(player.name)}
            name={player.name}
            avi={player.avi}
            startScore={player.score}
            setScore={(score) => setScore(player.name, score)}
            setAvatar={(url) => changeAvatar(player.name, url)}
          />
        ))}
      </div>
      <AddPlayer players={players} onSubmit={handleSubmit} />
      <div className="page-style">
        <div className="background-color">
          <h2>Background Color</h2>
          <SketchPicker
            className="color-picker"
            color={pageStyle.backgroundColor}
            onChangeComplete={changeColor}
          />
        </div>
        <div className="background-pattern">
          <h2>Background Pattern</h2>
          <button onClick={previousBackgroundPattern}>&lt;</button>
          <button onClick={clearBackgroundPattern}>Clear</button>
          <button onClick={nextBackgroundPattern}>&gt;</button>
          <div className="pattern-name">
          {
            pageStyle.backgroundImage.filename.
              replaceAll(/[-_]/g, ' ').
              replace(/^\s?\w/, (c) => c.toUpperCase()).
              slice(0,-4)
          }
          </div>
        </div>
      </div>
      <div className="actions">
        <button onClick={updateServer}>Update</button>
        <button onClick={shuffleScores}>Shuffle</button>
        <button onClick={openView}>View</button>
      </div>
      <GlobalStyle pageStyle={pageStyle} />
    </div>
  );
}
