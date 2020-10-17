const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        
        pdf: { type: DataTypes.BLOB('long'), allowNull: true }
        
    };

   

    return sequelize.define('pdf', attributes);
}