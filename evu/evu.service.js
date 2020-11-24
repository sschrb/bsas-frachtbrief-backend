
const db = require('_helpers/db');

module.exports = {
    
    getAll,
    getById,
    create,
    update,
    delete: _delete
};



async function getAll() {
    return await db.Evu.findAll();
}

async function getById(id) {
    return await getEvu(id);
}

async function create(params) {
   

    // save Frachtbrief
    await db.Evu.create(params);
}

async function update(id, params) {
    const evu = await getEvu(id);

   

    // copy params to user and save
    Object.assign(evu, params);
    await evu.save();

    console.log('update durch')
    return omitHash(evu.get());
}

async function _delete(id) {
    const evu = await getEvu(id);
    await evu.destroy();
}

// helper functions

async function getEvu(id) {
    const evu = await db.Evu.findByPk(id);
    if (!evu) throw 'EVU not found';
    return evu;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}