const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

module.exports = {
    
    getAll,
    getById,
    getAllStatus,
    create,
    getAllVorlagen,
    update,
    delete: _delete
};

async function getAllStatus(wert) {
    return await db.Ladeliste.findAll({
        where: {
          status: wert
        }
      });
}

async function getAllVorlagen() {
    return await db.Ladeliste.findAll({
        where: {
          vorlage: 'true'
        }
      });
}

async function getAll() {
    return await db.Ladeliste.findAll();
}

async function getById(id) {
    return await getLadeliste(id);
}

async function create(params) {
   

    // save Ladeliste
    await db.Ladeliste.create(params);
}

async function update(id, params) {
    const ladeliste = await getLadeliste(id);

   

    // copy params to user and save
    Object.assign(ladeliste, params);
    await ladeliste.save();

    console.log('update durch')
    return omitHash(ladeliste.get());
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

// helper functions

async function getLadeliste(id) {
    const ladeliste = await db.Ladeliste.findByPk(id);
    if (!ladeliste) throw 'Ladeliste not found';
    return ladeliste;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}