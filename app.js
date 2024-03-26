const express = require('express');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql');
const path = require('path');
const app = express();


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'DB Admin',
    password: 'Adminpassword',
    database: 'passport_js_test'
});

connection.connect();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'secret', 
    resave: false, 
    saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    (username, password, done) => {
        // find user by username in db
        connection.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
            if (error) {
                return done(error);
            }
            
            if (results.length === 0) {
                // user not found
                return done(null, false, { message: 'Ongeldige gebruikersnaam of wachtwoord' });
            }
            
            const user = results[0];
            // compare password with hashed password in db
            bcrypt.compare(password, user.password, (error, isMatch) => {
                if (error) {
                    return done(error);
                }
                if (!isMatch) {
                    // failed login
                    return done(null, false, { message: 'Ongeldige gebruikersnaam of wachtwoord' });
                }
                // login successful
                return done(null, user);
            });
        });
    }
));


passport.serializeUser((user, done) => {
    done(null, user.id);});

passport.deserializeUser((id, done) => {
    connection.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if(error) {
            return done(error);
        }   
        if (results.length === 0) {
            return done(null, false);
        }
        const user = results[0];
        return done(null, user);
    });
});

const indexRouter = require('./routes/index');
app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});