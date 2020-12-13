const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        bezeichnung: { type: DataTypes.STRING, allowNull: false },
        bemerkung: { type: DataTypes.STRING, allowNull: true },
        dichte: { type: DataTypes.FLOAT, allowNull: true },
        rid: { type: DataTypes.STRING, allowNull: true },
        nhm: { type: DataTypes.STRING, allowNull: true },
        wagentyp: { type: DataTypes.STRING, allowNull: true }
        
    };
    
    

    return sequelize.define('Ladegut', attributes);
}