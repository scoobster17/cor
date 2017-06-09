// server config dependencies
import PORTS from '../../../../server/config/ports';

// socket dependencies
import io from 'socket.io-client';
import EVENTS from './event-names';

const PROTOCOL = 'https'; // to be configurable?
const DOMAIN = 'localhost'; // to be configurable

let socket;

const createSocketConnection = () => {
    socket = io.connect(PROTOCOL + '://' + DOMAIN + ':' + PORTS.SECURE);
    socket.on(EVENTS.CONNECTION.TEST, function(data) {
        console.log(EVENTS.CONNECTION.TEST, data);
    });
}

export { socket as default, createSocketConnection };