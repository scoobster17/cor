// react dependencies
import React from 'react';
import { Route, IndexRoute } from 'react-router';

// app dependencies
// pages, and page layout component
import Layout from './layout';
import HomePage from '../components/pages/home';
import LoginPage from '../components/pages/login';

const routes = (
    <Route path="/" component={ Layout }>
        <IndexRoute component={ HomePage } />
        <Route path="login" component={ LoginPage } />
    </Route>
)

export default routes;