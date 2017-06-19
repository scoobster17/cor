// react dependencies
import React from 'react';

// app dependencies
import GlobalHeader from '../components/global/header';
import GlobalFooter from '../components/global/footer';
import COOKIES from './cookies/names';

class Layout extends React.Component {

    constructor() {
        super();

        this.state = {
            user: null
        };
    }

    render() {
        const { user } = this.state;
        return (
            <div>
                <GlobalHeader />
                {
                    // page content
                    React.cloneElement(this.props.children, { ...this.props, user })
                }
                <GlobalFooter />
            </div>
        )
    }

    componentDidMount() {

        // need to understand / read properly, but it works
        // https://stackoverflow.com/a/15724300/6189078
        function getCookie(name) {
          var value = "; " + document.cookie;
          var parts = value.split("; " + name + "=");
          if (parts.length == 2) return parts.pop().split(";").shift();
        }

        const userDetails = decodeURIComponent(getCookie(COOKIES.USER));

        // fetch user's details
        this.getUserDetails(userDetails).then((user) => {
            this.setUserDetails(JSON.parse(user));
        });

    }

    // setup user details promise
    getUserDetails(userDetails) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('POST', '/data/user/get', true);
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
            request.send(userDetails);
        });
    }

    setUserDetails(user) {
        this.setState({ user });
        this.forceUpdate(); // force the user to be pushed to children
    }
}


export default Layout;