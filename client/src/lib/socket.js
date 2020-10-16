import io from 'socket.io-client';

let socket;

export const connectSocket = (room, cb) => {
  socket = io();
  if (socket && room) socket.emit('join', room);

  socket.on('current', msg => {
    return cb(null, msg);
  });
}

export const disconnectSocket = () => {
  if(socket) socket.disconnect();
}

export const listenForChanges = (cb) => {
  if (!socket) return(true);
  socket.on('change', msg => {
    return cb(null, msg);
  });
}

export const sendScores = (room, players) => {
  if (socket) socket.emit('change', { players, room });
}
