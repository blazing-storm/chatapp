module.exports.chatSockets = function(socketServer) {
    // deprecated code from v2
    // let io = require('socket.io')(socketServer);

    // Since Socket.IO v3, you need to explicitly enable Cross-Origin Resource Sharing (CORS).
    // https://socket.io/docs/v4/handling-cors/
    let io = require('socket.io')(socketServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials:true
        }
    });

    io.sockets.on('connection', function(socket) {
        console.log('new connection received', socket.id);

        socket.on('disconnect', function() {
            console.log('socket disconnected!');
        });

        socket.on('join_room', function(data) {
            console.log('joining request received', data);

            socket.join(data.chatroom);

            io.in(data.chatroom).emit('user_joined', data);
        });

        // CHANGE :: detect send_message and broadcast to everyone in the room
        socket.on('send_message', function(data) {
            io.in(data.chatroom).emit('receive_message', data);
        });
    });
}