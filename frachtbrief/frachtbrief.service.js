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
   

    // save Frachtbrief
    await db.Frachtbrief.create(params);
}

async function update(id, params) {
    const frachtbrief = await getFrachtbrief(id);

    // validate
    const usernameChanged = params.username && user.username !== params.username;
    if (usernameChanged && await db.User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
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