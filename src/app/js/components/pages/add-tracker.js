// react dependencies
import React from 'react';
import { Link } from 'react-router';

class AddTrackerPage extends React.Component {

    constructor() {
        super();

        this.state = {
            form: {
                selectedTrackerType: 'people',
                competitorSearchResults: [],
                competitors: []
            }
        };

        this.handleTrackerTypeChange = this.handleTrackerTypeChange.bind(this);
        this.changeCompetitors = this.changeCompetitors.bind(this);
        this.isCompetitor = this.isCompetitor.bind(this);
    }

    render() {
        const { user } = this.props;
        const { selectedTrackerType, competitorSearchResults, competitors } = this.state.form;
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
                                <h3>Competitor Search</h3>
                                <label htmlFor="competitors">Search for competitors<span className="visually-hidden"> by email address</span>:</label>
                                <input type="text" id="competitorSearch" placeholder="Enter email address" />
                                <button id="competitorSearchSubmit">Search<span className="visually-hidden"> for competitor</span></button>
                                {
                                    competitorSearchResults &&
                                    <ul>
                                        {
                                            competitorSearchResults.map((person, index) => {
                                                return <li key={ index }>
                                                    <label htmlFor={ 'person-' + person.id }>{ person.username }</label>
                                                    <input type="checkbox" id={ 'person-' + person.id } value={ person.id } checked={ this.isCompetitor(person.id) } onChange={ this.changeCompetitors } />
                                                </li>;
                                            })
                                        }
                                    </ul>
                                }
                                <h3>Selected Competitors</h3>
                                {
                                    competitors &&
                                    <ul>
                                        {
                                            competitors.map((competitor, index) => {
                                                return <li key={ index }>
                                                    <label htmlFor={ 'competitors-' + competitor.id }>
                                                        { competitor['first-name'] + ' ' + competitor['last-name'] + ' (' + competitor.username + ')' }
                                                    </label>
                                                    <input type="checkbox" name="competitors" id={ 'competitor-' + competitor.id } value={ competitor.id } checked={ this.isCompetitor(competitor.id) } onChange={ this.changeCompetitors } />
                                                </li>;
                                            })
                                        }
                                    </ul>
                                }
                            </fieldset>
                            {
                                /*
                                FUTURE RELEASE? Allow people to be admins
                                <fieldset hidden={ selectedTrackerType !== 'people' }>
                                    <h3>Administrators</h3>
                                </fieldset>
                                */
                            }
                            <fieldset hidden={ selectedTrackerType !== 'team' }>
                                COMING SOON! Sorry, this feature is not yet supported.
                            </fieldset>
                        </fieldset>
                    </fieldset>
                    <input type="submit" value="Add score tracker" />
                </form>
            </main>
        )
    }

    handleTrackerTypeChange(event) {
        this.setState({
            form: {
                ...this.state.form,
                selectedTrackerType: event.target.value.toLowerCase()
            }
        });
    }

    changeCompetitors(event) {

        let { competitors, competitorSearchResults } = this.state.form;

        // if checked, add to list of competitors
        if (event.target.checked) {
            const competitorDetails = competitorSearchResults.filter((competitor) => {
                const actualId = event.target.getAttribute('id').replace(/^(competitor\-|person\-)/, '');
                return actualId === competitor.id;
            });
            competitors.push(competitorDetails[0]);

        // else remove competitor from list
        } else {
            const competitorIndex = competitors.findIndex((competitor) => {
                const actualId = event.target.getAttribute('id').replace(/^(competitor\-|person\-)/, '');
                return actualId === competitor.id;
            });
            competitors = [
                ...competitors.slice(0, competitorIndex),
                ...competitors.slice(competitorIndex + 1)
            ];
        }

        this.setState({
            form: {
                ...this.state.form,
                competitors
            }
        });
    }

    isCompetitor(id) {
        const { competitors } = this.state.form;
        const match = competitors.filter((competitor) => {
            return competitor.id === id;
        });
        return match.length;
    }

    componentWillMount() {
        // get current user details unless already stored in state?

        // get users to list in competitor lists
    }

    componentDidMount() {

        const addTrackerForm = document.getElementById('add-tracker-form');

        // handle add tracker submission
        addTrackerForm.addEventListener('submit', (event) => {

            event.preventDefault();

            // promises should be used to add callback functionality

            // create ajax request as post sending JSON
            const request = new XMLHttpRequest();
            request.open('POST', '/data/scores/add', true);
            request.setRequestHeader("Content-Type", "application/json");

            // to be improved - get inputs
            const inputs = addTrackerForm.querySelectorAll('input[name][type="text"], input[name][type="checkbox"], input[type="radio"]');
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

        // handle competitor search
        const competitorSearchInput = document.getElementById('competitorSearch');
        const competitorSearchBtn = document.getElementById('competitorSearchSubmit');

        competitorSearchSubmit.addEventListener('click', (event) => {
            event.preventDefault();
            this.handleGetCompetitors(competitorSearchInput.value);
            return false;
        });
    }

    handleGetCompetitors(competitorEmail) {
        this.getCompetitors(competitorEmail).then((users) => {
            this.setCompetitors(JSON.parse(users));
        });
    }

    getCompetitors(competitorEmail) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('POST', '/data/user/search', true);
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
            request.send(JSON.stringify({ email: competitorEmail }));
        });
    }

    setCompetitors(users) {
        this.setState({
            form: {
                ...this.state.form,
                competitorSearchResults: users
            }
        });
    }
}

export default AddTrackerPage;