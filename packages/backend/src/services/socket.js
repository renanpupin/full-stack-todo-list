const socketIo = require('socket.io');
let io;

exports.setupSocket = ( server ) => {
    //instance
    io = socketIo(server, {
        transports: ['websocket']
    });

    //events
    io.on('connection', function (socket) {
        console.log("[SOCKET] connection", socket.id);

        socket.on('error', async (err) => {
            console.log("[SOCKET] error", err);
        });

        socket.on('disconnect', async function () {
            console.log("[SOCKET] disconnect", socket.id);
        });
    });

    return io;
};

//event to emit events outside socket file
exports.send = ( event, data ) => {
    io.emit(event ,data);
}

