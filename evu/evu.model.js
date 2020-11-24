const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        name: { type: DataTypes.STRING, allowNull: false },
        short: { type: DataTypes.STRING, allowNull: true },
        code: { type: DataTypes.STRING, allowNull: true }
        
    };
    
    

    return sequelize.define('Evu', attributes);
}