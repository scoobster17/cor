// react dependencies
import React from 'react';
import { Link } from 'react-router';

class GlobalHeader extends React.Component {
    render() {
        return (
            <header className="global-header">
                <nav>
                    <ul className="site-home list-unstyled">
                        <li>
                            <Link to="/scores">
                                Cor scorekeeper app
                            </Link>
                        </li>
                    </ul>
                    <ul className="global-nav list-unstyled list-inline">
                        <li>
                            <Link to="/scores">
                                My scores
                            </Link>
                        </li>
                        <li>
                            <Link to="/add-tracker">
                                Add new scoresheet
                            </Link>
                        </li>
                    </ul>
                    <ul className="secondary-nav list-unstyled list-inline">
                        <li>
                            <a href="/log-out">
                                Log out
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>
        )
    }
}

export default GlobalHeader;