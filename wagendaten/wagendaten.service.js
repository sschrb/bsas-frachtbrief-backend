
const db = require('_helpers/db');

module.exports = {
    
    getAll,
    getById,
    create,
    update,
    delete: _delete
};



async function getAll() {
    return await db.Wagendaten.findAll();
}

async function getById(id) {
    return await getWagendaten(id);
}

async function create(params) {
   

    // save Frachtbrief
    await db.Wagendaten.create(params);
}

async function update(id, params) {
    const wagendaten = await getWagendaten(id);

   

    // copy params to user and save
    Object.assign(wagendaten, params);
    await wagendaten.save();

    console.log('update durch')
    return omitHash(wagendaten.get());
}

async function _delete(id) {
    const wagendaten = await getWagendaten(id);
    await wagendaten.destroy();
}

// helper functions

async function getWagendaten(id) {
    const wagendaten = await db.Wagendaten.findByPk(id);
    if (!wagendaten) throw 'Wagendaten not found';
    return wagendaten;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}