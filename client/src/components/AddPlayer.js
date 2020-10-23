import { useInput } from "../hooks/input-hook";
import React from "react";
import "./AddPlayer.css";

export default function AddPlayer({ players, onSubmit }) {
  const { value, bind, reset } = useInput("");

  function addPlayer(e) {
    e.preventDefault();
    if (value !== "" && !players.some((p) => p.name === value)) {
      onSubmit({ name: value, score: 0 });
    }
    reset();
  }

  return (
    <form className="add-player" target="_blank" onSubmit={addPlayer}>
      <label>Add Player</label>
      <input type="text" placeholder="Name" {...bind}></input>
      <button type="submit">Go</button>
    </form>
  );
}
