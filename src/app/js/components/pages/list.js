// react dependencies
import React from 'react';
import { Link } from 'react-router';

// app dependencies
import TrackerSummary from '../tracker/summary';

class ListPage extends React.Component {

    constructor() {
        super();

        this.state = {
            userTrackers: []
        }
    }

    render() {
        const { userTrackers } = this.state;
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
            </main>
        )
    }

    componentWillReceiveProps() {
        this.handleGetUserTrackers();
    }

    componentDidMount() {
        this.handleGetUserTrackers();
    }

    handleGetUserTrackers() {

        const { user } = this.props;

        // fetch user's score trackers
        if (user) {
            this.getUserTrackers(user).then((userTrackers) => {
                this.setUserTrackers(JSON.parse(userTrackers));
            });
        }
    }

    // setup user's score trackers promise
    getUserTrackers(user) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('POST', '/data/scores/get', true);
            request.setRequestHeader("Content-Type", "application/json");
            request.onload = () => {
                if (request.status >= 200 && request.status < 300) {
                    resolve(request.response);
                } else {
                    reject({
                        status: request.status,
                        statusText: request.statusText
                    });
                }
            };
            request.onerror = () => {
                reject({
                    status: request.status,
                    statusText: request.statusText
                });
            };
            request.send(JSON.stringify({ "id": user.id })); // should also search through competitor lists for trackers not owned
        });
    }

    setUserTrackers(userTrackers) {
        this.setState({ userTrackers });
    }
}

export default ListPage;