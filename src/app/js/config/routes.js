// react dependencies
import React from 'react';
import { Route, IndexRoute } from 'react-router';

// app dependencies
// pages, and page layout component
import Layout from './layout';
import HomePage from '../components/pages/home';
import LoginPage from '../components/pages/login';
import RegisterPage from '../components/pages/register';
import ListPage from '../components/pages/list';
import DetailsPage from '../components/pages/details';
import AddTrackerPage from '../components/pages/add-tracker';
import NotFoundPage from '../components/pages/404';

const routes = (
    <Route path="/" component={ Layout }>
        <IndexRoute component={ HomePage } />
        <Route path="login" component={ LoginPage } />
        <Route path="register" component={ RegisterPage } />
        <Route path="scores" component={ ListPage } />
        <Route path="scores/:urlText" component={ DetailsPage } />
        <Route path="add-tracker" component={ AddTrackerPage } />
        <Route path="404" component={ NotFoundPage } />
        <Route path="*" component={ NotFoundPage } />
    </Route>
)

export default routes;