import io from 'socket.io-client';

let socket;

export const connectSocket = (room, cb) => {
  socket = io({
    transports: ['polling']
  });
  if (socket && room) socket.emit('join', room);

  socket.on('current', msg => {
    return cb(null, msg);
  });
}

export const disconnectSocket = () => {
  if(socket) socket.disconnect();
}

export const listenForChanges = (cb, channel) => {
  if (!socket) return(true);
  socket.on(channel, msg => {
    return cb(null, msg);
  });
}

export const sendChanges = (room, players, pageStyle) => {
  const state = {players: players, pageStyle: pageStyle};
  if (socket) socket.emit('change', { state, room });
}
