// react dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import RoutesClientWrapper from './config/routes-client-wrapper';

// app dependencies
import { createSocketConnection } from './config/socket/connection';

window.onload = () => {
    ReactDOM.render(
        <RoutesClientWrapper />,
        document.getElementById('container')
    );
    createSocketConnection();
};