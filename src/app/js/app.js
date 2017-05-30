// react dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import RoutesClientWrapper from './config/routes-client-wrapper';

window.onload = () => {
    console.log('firing onload');
    ReactDOM.render(
        <RoutesClientWrapper />,
        document.getElementById('container')
    );
};