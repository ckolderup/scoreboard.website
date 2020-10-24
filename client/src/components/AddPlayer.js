import { useInput } from "../hooks/input-hook";
import PropTypes from 'prop-types';
import React from "react";
import "./AddPlayer.css";

const AddPlayer = (props) => {

  const { players, onSubmit } = props;
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
  )
}

AddPlayer.propType = {
  players: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default AddPlayer;
