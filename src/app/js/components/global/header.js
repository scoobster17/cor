// react dependencies
import React from 'react';
import { Link } from 'react-router';

class GlobalHeader extends React.Component {
    render() {
        return (
            <header className="global-header">
                <nav>
                    <ul>
                        <li>
                            <Link to="/">
                                Cor scorekeeper app
                            </Link>
                        </li>
                    </ul>
                    <ul className="global-nav">
                        <li>
                            <Link to="/">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/login">
                                Log in
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>
        )
    }
}

export default GlobalHeader;