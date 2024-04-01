export let pushSocketIDToArray = (clients, userID, socketID) => {
  if (clients[userID]) {
    // console.log('ciemt',clients, userID, socketID)
    clients[userID].push(socketID);
  } else {
    // console.log('ciemt222',clients, userID, socketID)
    clients[userID] = [socketID];
    // console.log(clients,clients[userID])
  }
  return clients;
};
export let emitToUser = (clients, userID, io, eventName, data) => {
  clients[userID].forEach((socketId) => io.to(socketId).emit(eventName, data));
};

export let removeSocketIDFromArray = (clients, userID, socket) => {
  clients[userID] = clients[userID]?.filter(
    (socketId) => socketId !== socket.id
  );

  if (!clients[userID]?.length) {
    delete clients[userID];
  }
  return clients;
};
