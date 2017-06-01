// react dependencies
import React from 'react';
import { Link } from 'react-router';

class DetailsPage extends React.Component {
    render() {
        return (
            <main>
                <h1>Phil vs Jon M (Pool)</h1>
                <p>Here are the details of your scorekeeping.</p>
                <dl>
                    <dt>Name</dt>
                        <dd>Phil vs. Jon M</dd>
                    <dt>Game / Activity</dt>
                        <dd>Pool</dd>
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
}

export default DetailsPage;