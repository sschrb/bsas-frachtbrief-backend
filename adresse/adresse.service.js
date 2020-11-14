
const db = require('_helpers/db');

module.exports = {
    
    getAll,
    getById,
    create,
    update,
    delete: _delete
};



async function getAll() {
    return await db.Adresse.findAll();
}

async function getById(id) {
    return await getAdresse(id);
}

async function create(params) {
   

    // save Frachtbrief
    await db.Adresse.create(params);
}

async function update(id, params) {
    const adresse = await getAdresse(id);

   

    // copy params to user and save
    Object.assign(adresse, params);
    await adresse.save();

    console.log('update durch')
    return omitHash(adresse.get());
}

async function _delete(id) {
    const adresse = await getAdresse(id);
    await adresse.destroy();
}

// helper functions

async function getAdresse(id) {
    const adresse = await db.Adresse.findByPk(id);
    if (!adresse) throw 'Adresse not found';
    return adresse;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}