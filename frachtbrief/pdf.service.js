const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

module.exports = {
    
    
    getById,
    create,
    
    
};





async function getById(id) {
    return await getPdf(id);
}

async function create(params) {
   

    // save Frachtbrief
   return await db.pdf.create(params);
}





// helper functions

async function getPdf(id) {
    const pdf = await db.pdf.findByPk(id);
    if (!pdf) throw 'pdf not found';
    return pdf;
}
