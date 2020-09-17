const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        adresse: { type: DataTypes.STRING, allowNull: false },
        wagenummer: { type: DataTypes.STRING, allowNull: false },
        
    };

   

    return sequelize.define('Frachtbrief', attributes);
}