
const db = require('_helpers/db');

module.exports = {
    
    getAll,
    getById,
    create,
    update,
    delete: _delete
};



async function getAll() {
    return await db.Erklarung.findAll();
}

async function getById(id) {
    return await getErklarung(id);
}

async function create(params) {
   

    // save Frachtbrief
    await db.Erklarung.create(params);
}

async function update(id, params) {
    const erklarung = await getErklarung(id);

   

    // copy params to user and save
    Object.assign(erklarung, params);
    await erklarung.save();

    console.log('update durch')
    return omitHash(erklarung.get());
}

async function _delete(id) {
    const erklarung = await getErklarung(id);
    await erklarung.destroy();
}

// helper functions

async function getErklarung(id) {
    const erklarung = await db.Erklarung.findByPk(id);
    if (!erklarung) throw 'Erklarung not found';
    return erklarung;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}