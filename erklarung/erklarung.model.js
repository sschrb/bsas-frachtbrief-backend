const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        code: { type: DataTypes.STRING, allowNull: false },
        
    };
    
    

    return sequelize.define('Erklarung', attributes);
}