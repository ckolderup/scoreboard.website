import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import './Welcome.css'

export default function Welcome() {
  const history = useHistory();
  const [room, setRoom] = useState("");

  useEffect(() => {
    fetch("/api/random-room")
      .then(res => res.json())
      .then((data) => {
        setRoom(data['random-room']);
      });
  }, []);

  function updateRoom(e) {
    setRoom(e.target.value);
  }

  function editRoom(room) {
    history.push(`/room/${ room }/edit`);
  }

  function viewRoom(room) {
    history.push(`/room/${room}`);
  }

  return (
    <div className="welcome">
      <h1>scoreboard.website</h1>
      <div className="welcome-text">
        Welcome! Choose a scoreboard below by entering a name. All scoreboards
        are deleted after 24 hours of inactivity. If you come across a board
        that's already in use, be a dear and just try a new name.
      </div>
      <div className="join-room">
        <input
          type="text"
          placeholder="Room name"
          onChange={updateRoom}
          defaultValue={room}
        ></input>
        <button onClick={() => {editRoom(room)}}>Edit</button>
        <button onClick={() => {viewRoom(room)}}>View</button>
      </div>
    </div>
  );
}
