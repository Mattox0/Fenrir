const cookies = require('cookies');
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const middleware = require('./modules/middleware');
const session = require('express-session')
const authRoutes = require('./routes/auth-routes');
const rootRoutes = require('./routes/root-routes');
const dashboardRoutes = require('./routes/dashboard-routes');

const app = express();

app.set('view engine', 'twig');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public/'));
app.locals.basedir = `${__dirname}/public`
app.use(session({
	secret: 'secret',
	resave: true,
    saveUninitialized: true,
	session: []
}));

app.set("twig options", {
    allowAsync: true
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookies.express('a','b','c'))

app.use('/', middleware.updateUser, rootRoutes, 
    authRoutes,
    middleware.updateUser, middleware.validateUser, middleware.updateGuilds, dashboardRoutes
);

app.get('*', (req, res) => {
    res.render('errors/404.twig');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Website is ready on port ${port}`);
});