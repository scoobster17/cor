// react dependencies
import React from 'react';
import { Link } from 'react-router';

class TrackerSummary extends React.Component {
    render() {
        const { tracker } = this.props;
        const trackerUrlText = tracker.name.toLowerCase().replace(/ /g, '-');
        return (
            <li>
                <Link to={`/scores/${trackerUrlText}`}>
                <dl>
                    <dt>Name</dt>
                        <dd dangerouslySetInnerHTML={{ __html: tracker && tracker.name }}></dd>
                    <dt>Activity</dt>
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
                </Link>
            </li>
        )
    }
}

export default TrackerSummary;


