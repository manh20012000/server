// bản chất là tạo ra 1 dạng dictionary với kiéne trức là với khi khới tạo 1 dang
//clinet = {} là dạng mà các key là iduser không được trùng nhau
// và sau đó thực thi kiểm tra nếu như có rồi thì mình truyền clients[userID] thì lấy được mảng [idsocket ]để có thể lấy được danh sách value
// để lấy được toàn bộ id hoặc toàn bộ value thì dùng Object.keys(clients); hoặc Object.value(clients);
// và dạng của nó sẻ clients;{ '66db170ed33fd38e5c9ad154': ['IseSQGRIGEiT8NLNAAAB'] }
//// nó sẻ clients;{ 'id user:[idsocker]}

export let pushSocketIDToArray = (clients, userID, socketID) => {
  console.log(clients[userID],'lất được giá trị khi có id truyền vào ')
  if (clients[userID]) {
    console.log(clients[userID],"ciemt", clients, userID, socketID);
    clients[userID].push(socketID);
  } else {
    console.log("ciemt222", clients, userID, socketID);
    clients[userID] = [socketID];
    console.log(clients, clients[userID],'hhhhaaaa');
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
