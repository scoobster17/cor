// utility dependencies
const fs = require('fs');

// server dependencies
import { Server as InsecureServer } from 'http';
import { Server as SecureServer } from 'https';

// server config dependencies
import PORTS from './ports';

const setupServers = (app) => {

    // HTTP server
    const insecureServer = InsecureServer(app).listen(PORTS.INSECURE, () => {

        const host = insecureServer.address().address || 'localhost';
        const port = insecureServer.address().port || PORTS.INSECURE;

        console.log('Cor scorekeeper app (insecure - HTTP) listening @ http://%s:%s for re-direct to HTTPS', host, port);
    });

    // HTTPS Server
    const secureServer = SecureServer(
        {
            key: fs.readFileSync(__dirname + '/../ssl/private.key'),
            cert: fs.readFileSync(__dirname + '/../ssl/certificate.pem')
        },
        app
    ).listen(PORTS.SECURE, () => {

        const host = secureServer.address().address || 'localhost';
        const port = secureServer.address().port || PORTS.SECURE;

        console.log('Cor scorekeeper app (secure - HTTPS) listening @ https://%s:%s', host, port);

    });

    return {
        insecureServer,
        secureServer
    };

};

export default setupServers;