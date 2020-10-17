const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

module.exports = {
    
    getAll,
    getById,
    create,
    update,
    delete: _delete
};



async function getAll() {
    return await db.Frachtbrief.findAll();
}

async function getById(id) {
    return await getFrachtbrief(id);
}

async function create(params) {
   console.log(params)

    // save Frachtbrief
    await db.Frachtbrief.create(params);
}

async function update(id, params) {
    const frachtbrief = await getFrachtbrief(id);

   

    // copy params to user and save
    Object.assign(frachtbrief, params);
    await frachtbrief.save();

    return omitHash(frachtbrief.get());
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

// helper functions

async function getFrachtbrief(id) {
    const frachtbrief = await db.Frachtbrief.findByPk(id);
    if (!frachtbrief) throw 'Frachtbrief not found';
    return frachtbrief;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}