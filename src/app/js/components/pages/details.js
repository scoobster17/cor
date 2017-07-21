// react dependencies
import React from 'react';
import { Link } from 'react-router';

// app dependencies
import ChatMessageList from '../chat/message-list';

// socket dependencies
import socket, { createSocketConnection } from '../../config/socket/connection';
import EVENTS from '../../config/socket/event-names';

class DetailsPage extends React.Component {

    constructor() {
        super();

        this.state = {
            tracker: {}
        }
    }

    render() {
        const { tracker } = this.state;
        return (
            <div>
                <main>
                    <h1>{ tracker && tracker.name }</h1>
                    <p>Here are the details of your scorekeeping.</p>
                    <dl>
                        <dt className="visually-hidden">Name</dt>
                            <dd className="visually-hidden" dangerouslySetInnerHTML={{ __html: tracker && tracker.name }}></dd>
                        <dt>Game / Activity</dt>
                            <dd dangerouslySetInnerHTML={{ __html: tracker && tracker.activity }}></dd>
                        <dt>Type</dt>
                            <dd dangerouslySetInnerHTML={{ __html: tracker && tracker.type }}></dd>
                        <dt>Number of players</dt>
                            <dd>2</dd>
                        <dt>Your wins</dt>
                            <dd>7</dd>
                        <dt>Your losses</dt>
                            <dd>5</dd>
                        <dt>Games drawn</dt>
                            <dd>0</dd>
                    </dl>
                </main>
                <aside>
                    <ChatMessageList title="Chat with other members of this activity" tracker={ tracker } />
                </aside>
            </div>
        )
    }

    componentDidMount() {

        // if the page has been rendered on the server side, we need to connect
        // to the socket once the page has been rendered in the client
        if (!socket) createSocketConnection();

        // fetch user's score tracker details
        this.getTracker();
        socket.on(EVENTS.SUCCESS.SCORES.FETCH.SINGLE, this.setInitialTrackerDetails.bind(this) );

    }

    // setup score tracker promise
    getTracker() {
        const trackerName = this.props.params.urlText;

        socket.emit(EVENTS.SCORES.FETCH.SINGLE, {
            "id": "9e0945f0-87e1-4dda-a28e-047b4500b1d7",
            "urlText": trackerName
        });

    }

    setInitialTrackerDetails(data) {
        this.setTracker(data.tracker);
    }

    setTracker(tracker) {
        this.setState({ tracker });
    }

}

export default DetailsPage;