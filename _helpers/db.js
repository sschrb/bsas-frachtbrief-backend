const config = require('config.json');

const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config.database;
    
    
    



    // connect to db
    const sequelize = new Sequelize(database, user, password, { host: host, dialect: 'postgres' });

    // init models and add them to the exported db object
    db.User = require('../users/user.model')(sequelize);

    db.Ladeliste = require('../ladeliste/ladeliste.model')(sequelize);
    db.Frachtbrief = require('../frachtbrief/frachtbrief.model')(sequelize);
    db.pdf = require('../frachtbrief/pdf.model')(sequelize);

    db.Bahnhof = require('../bahnhof/bahnhof.model')(sequelize);
    db.Adresse = require('../adresse/adresse.model')(sequelize);
    db.Erklarung = require('../erklarung/erklarung.model')(sequelize);
    db.Evu = require('../evu/evu.model')(sequelize);
    db.Wagendaten = require('../wagendaten/wagendaten.model')(sequelize);
    db.Ladegut = require('../ladegut/ladegut.model')(sequelize);

    // sync all models with database
    await sequelize.sync();
}