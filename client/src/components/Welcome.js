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

  function goToRoom(e) {
    e.preventDefault();

    console.log('okay i will!');
    history.push(`/room/${ room }/edit`);
  }

  return (
    <div className="welcome">
      <h1>Hello</h1>
      <div className="welcome-text">Join a room... if you dare! *spooky ghost noises*</div>
      <form className="join-room" target="_blank" onSubmit={goToRoom}>
        <input
          type="text"
          placeholder="Room name"
          onChange={updateRoom}
          defaultValue={room}
        ></input>
        <button type="submit">Join</button>
      </form>
    </div>
  );
}
