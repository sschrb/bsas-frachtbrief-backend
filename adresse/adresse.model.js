const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        name: { type: DataTypes.STRING, allowNull: false },
        strasse: { type: DataTypes.STRING, allowNull: true },
        ort: { type: DataTypes.STRING, allowNull: true },
        mail: { type: DataTypes.STRING, allowNull: true },
        telefon: { type: DataTypes.STRING, allowNull: true }
    };
    
    

    return sequelize.define('Adresse', attributes);
}