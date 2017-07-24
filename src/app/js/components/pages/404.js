// react dependencies
import React from 'react';
import { Link } from 'react-router';

class NotFoundPage extends React.Component {
    render() {
        return (
            <main>
                <h1>404</h1>
                <p>Page not found</p>
            </main>
        )
    }

    componentDidMount() {
        document.title = 'Page not found | Cor scorekeeper app'; // TODO include custom detail e.g. name?
    }
}

export default NotFoundPage;