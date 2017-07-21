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
                <p>Here is a list of all of the scoresheets you have tracked:</p>
                <ul className="faux-table-headers" aria-hidden="true">
                    <li>Name</li>
                    <li>Activity</li>
                    <li>Type</li>
                    <li><span className="visually-hidden">Number of </span>players</li>
                    <li>Wins</li>
                    <li>Losses</li>
                    <li>Draws</li>
                </ul>
                <ul className="tracker-list">
                    {
                        userTrackers &&
                        userTrackers.map((tracker, index) => {
                            return (<TrackerSummary tracker={ tracker } key={ index } />);
                        })
                    }
                </ul>
                <h2>Scores you are participating in</h2>
                <p>Here is a list of scores that you are participating in, but do not own.</p>
                <ul className="faux-table-headers" aria-hidden="true">
                    <li>Name</li>
                    <li>Activity</li>
                    <li>Type</li>
                    <li><span className="visually-hidden">Number of </span>players</li>
                    <li>Wins</li>
                    <li>Losses</li>
                    <li>Draws</li>
                </ul>
                <ul className="tracker-list">
                    {
                        participatingTrackers &&
                        participatingTrackers.map((tracker, index) => {
                            return (<TrackerSummary tracker={ tracker } key={ index } />);
                        })
                    }
                </ul>
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
        this.setState({
            userTrackers: data.owned,
            participatingTrackers: data.participating
        });
    }
}

export default ListPage;