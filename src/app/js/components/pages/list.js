// react dependencies
import React from 'react';
import { Link } from 'react-router';

// app dependencies
import TrackerSummary from '../tracker/summary';

// socket dependencies
import socket, { createSocketConnection } from '../../config/socket/connection';
import EVENTS from '../../config/socket/event-names';

class ListPage extends React.Component {

    constructor() {
        super();

        this.state = {
            userTrackers: [],
            participatingTrackers: []
        }
    }

    render() {
        const { userTrackers, participatingTrackers } = this.state;
        return (
            <main>
                <h1>Your scores</h1>
                <section>
                    <h2>Scores you created</h2>
                    <p>
                        {
                            userTrackers.length > 0 ?
                                'Here is a list of all of the scoresheets you have tracked:'
                            :
                                'You do not have any trackers currently.'
                        }
                    </p>
                    {
                        userTrackers.length > 0 &&
                        <ul className="faux-table-headers list-unstyled" aria-hidden="true">
                            <li>Name</li>
                            <li>Activity</li>
                            <li>Type</li>
                            <li><span className="visually-hidden">Number of </span>players</li>
                            <li>Wins</li>
                            <li>Losses</li>
                            <li>Draws</li>
                        </ul>
                    }
                    {
                        userTrackers.length > 0 &&
                        <ul className="tracker-list list-unstyled">
                            {
                                userTrackers.map((tracker, index) => {
                                    return (<TrackerSummary tracker={ tracker } key={ index } />);
                                })
                            }
                        </ul>
                    }
                </section>
                <section>
                    <h2>Scores you are participating in</h2>
                    <p>
                        {
                            participatingTrackers.length > 0 ?
                                'Here is a list of scores that you are participating in, but do not own.'
                            :
                                'You are not participating in any other trackers currently.'
                        }
                    </p>
                    {
                        participatingTrackers.length > 0 &&
                        <ul className="faux-table-headers list-unstyled" aria-hidden="true">
                            <li>Name</li>
                            <li>Activity</li>
                            <li>Type</li>
                            <li><span className="visually-hidden">Number of </span>players</li>
                            <li>Wins</li>
                            <li>Losses</li>
                            <li>Draws</li>
                        </ul>
                    }
                    {
                        participatingTrackers.length > 0 &&
                        <ul className="tracker-list list-unstyled">
                            {
                                participatingTrackers.map((tracker, index) => {
                                    return (<TrackerSummary tracker={ tracker } key={ index } />);
                                })
                            }
                        </ul>
                    }
                </section>
            </main>
        )
    }

    componentWillReceiveProps() {
        // fetch user's score trackers
        this.handleGetUserTrackers();
    }

    componentDidMount() {
        // fetch user's score trackers
        this.handleGetUserTrackers();
    }

    handleGetUserTrackers() {

        const { user } = this.props;

        // fetch user's score trackers
        if (user) {

            // if the page has been rendered on the server side, we need to connect
            // to the socket once the page has been rendered in the client
            if (!socket) createSocketConnection();

            socket.on(EVENTS.SUCCESS.SCORES.FETCH.ALL, this.setInitialUserTrackers.bind(this) );
            this.getUserTrackers(user);
        }
    }

    // setup user's score trackers promise
    getUserTrackers(user) {
        socket.emit(EVENTS.SCORES.FETCH.ALL, {
            "id": user.id
        });
    }

    setInitialUserTrackers(data) {
        document.title = 'Your Scores | Cor scorekeeper app'; // TODO include custom detail e.g. name?
        this.setState({
            userTrackers: data.owned,
            participatingTrackers: data.participating
        });
    }
}

export default ListPage;