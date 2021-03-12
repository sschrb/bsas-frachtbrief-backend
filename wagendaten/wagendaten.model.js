const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        wagennummer: { type: DataTypes.BIGINT, allowNull: false },
        halter: { type: DataTypes.STRING, allowNull: true },
        achsanzahl: { type: DataTypes.STRING, allowNull: true },
        eigengewicht: { type: DataTypes.INTEGER, allowNull: true }
        
    };
    
    

    return sequelize.define('Wagendaten', attributes);
}