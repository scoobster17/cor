// react dependencies
import React from 'react';
import { Link } from 'react-router';

class RegisterPage extends React.Component {
    render() {
        return (
            <main>
                <form id="register-form">
                    <h1>Register</h1>
                    <p>Register to start tracking your scores.</p>
                    <fieldset>
                        <h2>Personal details</h2>
                        <label htmlFor="first-name">First name:</label>
                        <input type="text" id="first-name" name="first-name" />
                        <label htmlFor="last-name">Last name:</label>
                        <input type="text" id="last-name" name="last-name" />
                        <label htmlFor="email">Email address:</label>
                        <input type="email" id="email" name="email" />
                    </fieldset>
                    <button>Register</button>
                </form>
            </main>
        )
    }

    componentDidMount() {

        const registerForm = document.getElementById('register-form');

        registerForm.addEventListener('submit', (event) => {

            event.preventDefault();

            // promises should be used to add callback functionality

            // create ajax request as post sending JSON
            const request = new XMLHttpRequest();
            request.open('POST', '/data/users/add', true);
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

export default RegisterPage;