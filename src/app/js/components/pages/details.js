// react dependencies
import React from 'react';
import { Link } from 'react-router';

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
            <main>
                <h1>Phil vs Jon M (Pool)</h1>
                <p>Here are the details of your scorekeeping.</p>
                <dl>
                    <dt>Name</dt>
                        <dd dangerouslySetInnerHTML={{ __html: tracker && tracker.name }}></dd>
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
        )
    }

    componentDidMount() {

        // fetch user's score trackers
        this.getTracker().then((tracker) => {
            this.setTracker(JSON.parse(tracker));
        });

    }

    // setup score tracker promise
    getTracker() {
        const trackerName = this.props.params.urlText;
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
            request.send(JSON.stringify({
                "id": "9e0945f0-87e1-4dda-a28e-047b4500b1d7",
                "urlText": trackerName
            })); // needs to be dynamic, and also search through competitor lists for trackers not owned
        });
    }

    setTracker(tracker) {
        this.setState({ tracker });
    }

}

export default DetailsPage;