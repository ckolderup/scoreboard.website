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
      <h1>Hello</h1>
      <div className="welcome-text">
        Join a room... if you dare! *spooky ghost noises*
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
