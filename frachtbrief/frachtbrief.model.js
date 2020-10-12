const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        adresse: { type: DataTypes.STRING, allowNull: false },
        wagenummer: { type: DataTypes.STRING, allowNull: false },
        pdf_id: { type: DataTypes.INTEGER, allowNull: true }
        
    };

   

    return sequelize.define('Frachtbrief', attributes);
}