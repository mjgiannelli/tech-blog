require('dotenv').config();
const express = require('express');
const routes = require('./controllers');
const exphbs = require('express-handlebars');
const session = require('express-session');
const path = require('path');
var morgan = require('morgan')


const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: 'some random string of words irony',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sess));

const helpers = require('./utils/helpers');

const hbs = exphbs.create({ helpers });

//creates the handlebar engine
app.set('view engine', 'handlebars');
app.engine('handlebars', hbs.engine);

// middleware
//connect front end
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('tiny'))

// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});