// socket dependencies
import io from 'socket.io-client';

let socket;

const createSocketConnection = () => {
    socket = io.connect('http://localhost:6077');
    socket.on('receiving from server', function(data) {
        console.log(data);
    });
}

export { socket as default, createSocketConnection };