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

        // bind event to receive the tracker details
        socket.on(EVENTS.SUCCESS.SCORES.FETCH.SINGLE, this.setInitialTrackerDetails.bind(this) );

    }

    // setup score tracker promise
    getTracker() {
        socket.emit(EVENTS.SCORES.FETCH.SINGLE, {
            "urlText": this.props.params.urlText
        });
    }

    setInitialTrackerDetails(data) {
        document.title = 'Score Details Page | Cor scorekeeper app'; // TODO include custom detail e.g. name?
        this.setTracker(data.tracker);
    }

    setTracker(tracker) {
        this.setState({ tracker });

        // join a room specific to this score so chat for example can be emitted
        // to all socket connections in this room
        socket.emit(EVENTS.ROOM.JOIN, {
            trackerId: tracker.id
        });
    }

}

export default DetailsPage;