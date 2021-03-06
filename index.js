const express = require('express');
const app = express();
const port = 3000;
const expressLayouts = require('express-ejs-layouts');

const db = require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo');

const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

// set up the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('Chat Server is listening on port: 5000');

// gets compiled when the page loads
app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));

app.use(express.urlencoded());
app.use(cookieParser());

// add this before router
app.use(expressLayouts);

app.use(express.static('./assets'));
// make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

// extract styles and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// set up view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in the db
// Solved the mongo store issue(v3 vs v4) using client instead of mongooseConnection
app.use(session({
    name: 'chatapp',
    // TODO change the secret before deployment in production mode
    secret: "inazumaeleven",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
            client: db.getClient(),
            autoRemove: 'disabled'
        }, function(err) {
            console.log(err || 'connect-mongodb setup is working');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use('/', require('./routes'));

app.listen(port, function(err) {
    if(err) {
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
})