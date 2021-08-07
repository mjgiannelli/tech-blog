const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const app = express();
const PORT = process.env.PORT || 3001;
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});
const session = require('express-session');
require('dotenv').config();
const path = require('path');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: process.env.secret,
    cookie: {},
    resave: false,
    saveUnitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sess));

//creates the handlebar engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// middleware
//connect front end
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});