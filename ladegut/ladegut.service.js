
const db = require('_helpers/db');

module.exports = {
    
    getAll,
    getById,
    create,
    update,
    delete: _delete
};



async function getAll() {
    return await db.Ladegut.findAll();
}

async function getById(id) {
    return await getLadegut(id);
}

async function create(params) {
   

    // save Frachtbrief
    await db.Ladegut.create(params);
}

async function update(id, params) {
    const ladegut = await getLadegut(id);

   

    // copy params to user and save
    Object.assign(ladegut, params);
    await ladegut.save();

    console.log('update durch')
    return omitHash(ladegut.get());
}

async function _delete(id) {
    const ladegut = await getLadegut(id);
    await ladegut.destroy();
}

// helper functions

async function getLadegut(id) {
    const ladegut = await db.Ladegut.findByPk(id);
    if (!ladegut) throw 'Ladegut not found';
    return ladegut;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}