// react dependencies
import React from 'react';
import { Link } from 'react-router';

class AddTrackerPage extends React.Component {

    constructor() {
        super();

        this.state = {
            form: {
                selectedTrackerType: 'people'
            }
        };

        this.handleTrackerTypeChange = this.handleTrackerTypeChange.bind(this);
    }

    render() {
        const { user } = this.props;
        const { selectedTrackerType } = this.state.form;
        return (
            <main>
                <form id="add-tracker-form">
                    <h1>Add a score tracker</h1>
                    <p>Create a tracking sheet for your scores here.</p>
                    <fieldset>
                        <input type="hidden" name="creator" value={ user && user.id } />
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
                            <input type="radio" name="type" id="people" value="people" checked={ this.state.form.selectedTrackerType === 'people' } onChange={ this.handleTrackerTypeChange } />
                            <label htmlFor="team">Team</label>
                            <input type="radio" name="type" id="team" value="team" checked={ this.state.form.selectedTrackerType === 'team' } onChange={ this.handleTrackerTypeChange } />
                            <fieldset hidden={ selectedTrackerType !== 'people' }>
                                <label htmlFor="competitors">Competitors:</label>
                                <input type="text" id="competitors" name="competitors" />
                            </fieldset>
                            <fieldset hidden={ selectedTrackerType !== 'people' }>
                                <h3>Administrators</h3>
                            </fieldset>
                            <fieldset hidden={ selectedTrackerType !== 'team' }>
                                COMING SOON! Sorry, this feature is not yet supported.
                            </fieldset>
                        </fieldset>
                    </fieldset>
                    <button>Add score tracker</button>
                </form>
            </main>
        )
    }

    handleTrackerTypeChange(event) {
        this.setState({
            form: {
                selectedTrackerType: event.target.value.toLowerCase()
            }
        });
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

            formDataObj['type'] = this.state.form.selectedTrackerType;
            formDataObj['urlText'] = formDataObj.name.toLowerCase().replace(/ /g, '-');

            // send data via AJAX
            request.send(JSON.stringify(formDataObj));

            return false;

        });
    }
}

export default AddTrackerPage;