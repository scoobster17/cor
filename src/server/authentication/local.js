// server authentication dependencies
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const authenticationSetup = (db) => {

    passport.serializeUser((user, done) => {
        done(null, user.username);
    });

    passport.deserializeUser((username, done) => {
        db.users().find({ "username": username }).toArray((err, users) => {
            done(err, users[0]);
        });
    });

    // set up authentication using a username and password
    passport.use(new LocalStrategy(
        (username, password, done) => {

            db.users().find({ "username": username }).toArray((err, users) => {

                if (err) {
                    return done(null, false, {
                        message: 'An error has occurred.'
                    });
                }

                if (!users.length) {
                    return done(null, false, {
                        message: 'Incorrect username or password.' // same message?
                    });
                }

                if (users[0].password != password) {
                    return done(null, false, {
                        message: 'Incorrect username or password.'
                    });
                }

                return done(null, users[0]);

            });


        }
    ));
};

export default authenticationSetup;