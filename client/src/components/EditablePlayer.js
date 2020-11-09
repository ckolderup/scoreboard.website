import React from 'react';

import "./EditablePlayer.css";

export default function EditablePlayer(props) {
  const { name, startScore, avi, setScore, setAvatar, removePlayer } = props;

  const uploadFile = async e => {
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'scoreboard');

    const res = await fetch('https://api.cloudinary.com/v1_1/dzq1zuoja/image/upload', {
      method: 'POST',
      body: data,
    });

    const file = await res.json();
    setAvatar(file.secure_url);
  }

  return (
    <div className="player">
      <button className="trash-button" onClick={removePlayer}>
        ❌
      </button>
      <input type="file" placeholder="Upload"
        required onChange={uploadFile} />
      {avi && (<img className="edit-avatar" src={avi}/>)}
      <h2 className="name">{name}</h2>
      <input
        type="number"
        className="score"
        onChange={e => setScore(e.target.value)}
        value={startScore}
      />
    </div>
  );
}
