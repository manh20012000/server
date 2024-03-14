export let pushSocketIDToArray = (clients, userID, socketID) => {
    if (clients[userID]) {
        clients[userID].push(socketID);
    } else {
        clients[userID] = [socketID];
    }
    return clients;
};

export let emitToUser = (clients, userID, io, eventName, data) => {
    clients[userID].forEach(socketId =>
        io.to(socketId).emit(eventName, data)
    );
};

export let removeSocketIDFromArray = (clients, userID, socket) => {
    clients[userID] = clients[userID]?.filter(
        socketId => socketId !== socket.id
    );

    if (!clients[userID]?.length) {
        delete clients[userID];
    }
    return clients;
};
