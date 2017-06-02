// react dependencies
import React from 'react';
import { Link } from 'react-router';

class AddTrackerPage extends React.Component {
    render() {
        return (
            <main>
                <form id="add-tracker-form">
                    <h1>Add a score tracker</h1>
                    <p>Create a tracking sheet for your scores here.</p>
                    <fieldset>
                        <input type="hidden" name="creator" value="thisUsersId" />
                    </fieldset>
                    <fieldset>
                        <h2>Tracker details</h2>
                        <label htmlFor="name">Tracker name:</label>
                        <input type="text" id="name" name="name" placeholder="Work pool scores" />
                        <label htmlFor="activity">Activity:</label>
                        <input type="text" id="activity" name="activity" placeholder="Pool" />
                        <fieldset>
                            <span>Tracker type:</span>
                            <label htmlFor="people">People</label>
                            <input type="radio" name="type" id="people" value="People" checked="checked" />
                            <label htmlFor="team">Team</label>
                            <input type="radio" name="type" id="team" value="Team" />
                            <fieldset className="competitorInformation">
                                <label htmlFor="competitors">Competitors:</label>
                                <input type="text" id="competitors" name="competitors" />
                            </fieldset>
                            <fieldset className="competitorInformation">
                                <h3>Administrators</h3>
                            </fieldset>
                            <fieldset className="teamInformation">
                                Sorry, this feature is not yet supported!
                            </fieldset>
                        </fieldset>
                    </fieldset>
                    <button>Add score tracker</button>
                </form>
            </main>
        )
    }

    componentWillMount() {
        // get current user details unless already stored in state?

        // get users to list in competitor lists
    }

    componentDidMount() {

        const registerForm = document.getElementById('add-tracker-form');

        registerForm.addEventListener('submit', (event) => {

            event.preventDefault();

            // promises should be used to add callback functionality

            // create ajax request as post sending JSON
            const request = new XMLHttpRequest();
            request.open('POST', '/data/scores/add', true);
            request.setRequestHeader("Content-Type", "application/json");

            // to be improved - get inputs
            const inputs = registerForm.getElementsByTagName('input');
            const formDataObj = {};

            // assign form data to object
            for (let i=0; i<inputs.length; i++) {
                formDataObj[inputs[i].name] = inputs[i].value;
            }

            // send data via AJAX
            request.send(JSON.stringify(formDataObj));
            return false;

        });
    }
}

export default AddTrackerPage;