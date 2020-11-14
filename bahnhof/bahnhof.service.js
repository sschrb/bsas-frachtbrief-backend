
const db = require('_helpers/db');

module.exports = {
    
    getAll,
    getById,
    create,
    update,
    delete: _delete
};



async function getAll() {
    return await db.Bahnhof.findAll();
}

async function getById(id) {
    return await getBahnhof(id);
}

async function create(params) {
   

    // save Frachtbrief
    await db.Bahnhof.create(params);
}

async function update(id, params) {
    const bahnhof = await getBahnhof(id);

   

    // copy params to user and save
    Object.assign(bahnhof, params);
    await bahnhof.save();

    console.log('update durch')
    return omitHash(bahnhof.get());
}

async function _delete(id) {
    const bahnhof = await getBahnhof(id);
    await bahnhof.destroy();
}

// helper functions

async function getBahnhof(id) {
    const bahnhof = await db.Bahnhof.findByPk(id);
    if (!bahnhof) throw 'Bahnhof not found';
    return bahnhof;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}