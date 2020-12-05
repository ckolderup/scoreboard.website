import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Flipper, Flipped } from "react-flip-toolkit";
import Player from "./Player.js";
import { connectSocket, disconnectSocket, listenForChanges } from "../lib/socket.js";
import { createGlobalStyle } from "styled-components";
import patterns from '../lib/heropatterns';

import "./ScoreBoard.css";

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

export default function ScoreBoard() {
  let { roomId } = useParams();

  const [players, setPlayers] = useState([]);
  const [pageStyle, setPageStyle] = useState({
    backgroundColor: { hex: '#222', rgb: { 'r': 34, 'g': 34, 'b': 34 } },
    backgroundImage: { index: 0, filename: patterns[0] },
  });

  const [room] = useState(roomId);

  useEffect(() => {
    if (room)
      connectSocket(`${room}-board`, (err, data) => {
        if (err) {
          console.log(err);
          return;
        }
        if (data) {
          data.players.sort((a, b) => a.score - b.score);
          setPlayers(data.players || []);
          setPageStyle(data.pageStyle || {});
        }
      });

    listenForChanges((err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      data.sort((a, b) => a.score - b.score);
      setPlayers(data.players || []);
      setPageStyle(data.pageStyle || {});
    }, 'change');

    return () => {
      disconnectSocket();
    };
  }, [room]);

  return (
    <div className="scoreboard">
      <h1>Scores</h1>
      <Flipper spring="gentle" staggerConfig={{default:{speed: 0.1}}} className="scores" flipKey={players.map((x) => x.name).join("")}>
        {players.map((player) => (
          <Flipped key={player.name} flipId={player.name}>
            <Player {...player} />
          </Flipped>
        ))}
      </Flipper>
      <GlobalStyle pageStyle={pageStyle} />
    </div>
  );
}
