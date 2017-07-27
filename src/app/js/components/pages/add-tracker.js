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
            <main className="add-tracker-page">
                <form id="add-tracker-form">
                    <h1>Add a score tracker</h1>
                    <p>Create a tracking sheet for your scores here.</p>
                    <fieldset>
                        <input type="hidden" name="creator" value={ user && user.id } />
                    </fieldset>
                    <fieldset>
                        <div className="pure-u-1-2">
                            <h2>Tracker details</h2>
                            <label htmlFor="name">Tracker name:</label>
                            <input type="text" id="name" name="name" placeholder="Work pool scores" />
                            <label htmlFor="activity">Activity:</label>
                            <input type="text" id="activity" name="activity" placeholder="Pool" />
                        </div>
                        <fieldset className="pure-u-1-2">
                            <span className="h2">Tracker type:</span>
                            <div className="radio-field">
                                <label htmlFor="people">People</label>
                                <input type="radio" name="type" id="people" value="people" checked={ this.state.form.selectedTrackerType === 'people' } onChange={ this.handleTrackerTypeChange } />
                            </div>
                            <div className="radio-field">
                                <label htmlFor="team">Team</label>
                                <input type="radio" name="type" id="team" value="team" checked={ this.state.form.selectedTrackerType === 'team' } onChange={ this.handleTrackerTypeChange } />
                            </div>
                            <fieldset hidden={ selectedTrackerType !== 'people' }>
                                <h3>Competitor Search</h3>
                                <label htmlFor="competitorSearch">Search for competitors<span className="visually-hidden"> by email address</span>:</label>
                                <input type="text" id="competitorSearch" placeholder="Enter email address" />
                                <button id="competitorSearchSubmit" className="button">Search<span className="visually-hidden"> for competitors</span></button>
                                {
                                    competitorSearchResults &&
                                    <ul className="list-unstyled">
                                        {
                                            competitorSearchResults.map((person, index) => {
                                                return <li key={ index } className="checkbox-field">
                                                    <label htmlFor={ 'person-' + person.id }>{ person.username }</label>
                                                    <input type="checkbox" id={ 'person-' + person.id } value={ person.id } checked={ this.isCompetitor(person.id) } onChange={ this.changeCompetitors } />
                                                </li>;
                                            })
                                        }
                                    </ul>
                                }
                                <h3>Selected Competitors</h3>
                                {
                                    !competitors.length &&
                                    <p>You have no competitors. Use the form above to search for people to score against!</p>
                                }
                                {
                                    competitors.length > 0 &&
                                    <ul className="list-unstyled">
                                        {
                                            competitors.map((competitor, index) => {
                                                return <li key={ index } className="checkbox-field">
                                                    <label htmlFor={ 'competitors-' + competitor.id }>
                                                        { competitor['first-name'] + ' ' + competitor['last-name'] + ' (' + competitor.username + ')' }
                                                    </label>
                                                    <input type="checkbox" name="competitors" id={ 'competitor-' + competitor.id } value={ competitor.id } checked={ this.isCompetitor(competitor.id) } onChange={ this.changeCompetitors } />
                                                </li>;
                                            })
                                        }
                                    </ul>
                                }
                                {
                                    competitors.length > 0 &&
                                    <div>
                                        <p>Search again to select more competitors.</p>
                                        <p>Don't worry, any competitors you have selected will stay in this list when you perform a new search.</p>
                                        <p>To remove a competitor, simply uncheck the box next to them. You can always search for them again if you do it by accident!</p>
                                    </div>
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
                    <input className="button" type="submit" value="Add score tracker" />
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

        document.title = 'Add score tracker | Cor scorekeeper app'; // TODO include custom detail e.g. name?

        const addTrackerForm = document.getElementById('add-tracker-form');

        // handle add tracker submission
        addTrackerForm.addEventListener('submit', (event) => {

            event.preventDefault();

            const competitorInputs = addTrackerForm.querySelectorAll('input[name="competitors"]');
            const competitorIds = [];
            for(let input of competitorInputs) {
                competitorIds.push(input.value);
            };

            // promises should be used to add callback functionality

            // create ajax request as post sending JSON
            const request = new XMLHttpRequest();
            request.open('POST', '/data/scores/add', true);
            request.setRequestHeader("Content-Type", "application/json");

            // to be improved - get inputs
            const inputs = addTrackerForm.querySelectorAll('input[name][type="text"], input[name][type="checkbox"], input[type="radio"], input[type="hidden"]');
            const formDataObj = {};

            // assign form data to object
            for (let i=0; i<inputs.length; i++) {
                formDataObj[inputs[i].name] = inputs[i].value;
            }

            formDataObj['type'] = this.state.form.selectedTrackerType;
            formDataObj['urlText'] = formDataObj.name.toLowerCase().replace(/ /g, '-');
            formDataObj['competitors'] = competitorIds;

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