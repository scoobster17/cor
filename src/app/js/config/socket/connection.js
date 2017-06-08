// socket dependencies
import io from 'socket.io-client';
import EVENTS from './event-names';

let socket;

const createSocketConnection = () => {
    socket = io.connect('http://localhost:6077');
    socket.on(EVENTS.CONNECTION.TEST, function(data) {
        console.log(EVENTS.CONNECTION.TEST, data);
    });
}

export { socket as default, createSocketConnection };