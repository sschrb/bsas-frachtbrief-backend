require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('_middleware/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// api routes
app.use('/users', require('./users/users.controller'));
app.use('/frachtbrief', require('./frachtbrief/frachtbrief.controller'));
app.use('/bahnhof', require('./bahnhof/bahnhof.controller'));
app.use('/adresse', require('./adresse/adresse.controller'));
app.use('/erklarung', require('./erklarung/erklarung.controller'));
app.use('/evu', require('./evu/evu.controller'));
app.use('/wagendaten', require('./wagendaten/wagendaten.controller'));
app.use('/ladegut', require('./ladegut/ladegut.controller'));
app.use('/ladeliste', require('./ladeliste/ladeliste.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = 4000;
app.listen(port, () => console.log('Server listening on port ' + port));