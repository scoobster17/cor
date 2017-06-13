// framework dependencies
import Express from 'express';
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

// app dependencies
import PORTS from '../config/ports';

const setupFramework = (app, authenticator) => {

    app.use( Express.static(__dirname + '/../../../dist/app/'));
    app.use( cookieParser() );
    app.use( bodyParser.urlencoded({ extended: false }) );
    app.use( bodyParser.json() );
    app.use( session({ secret: 'cor blimey' }) );
    app.use( authenticator.initialize() );
    app.use( authenticator.session() ); // needs to be after Express.session()

    app.set('port_https', PORTS.SECURE);

    // ejs setup
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/../views');

};

export default setupFramework;