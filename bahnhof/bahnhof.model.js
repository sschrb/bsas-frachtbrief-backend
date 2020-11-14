const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        name: { type: DataTypes.STRING, allowNull: false },
        bahnhofscode: { type: DataTypes.STRING, allowNull: true },
        laendercode: { type: DataTypes.STRING, allowNull: true },
        land: { type: DataTypes.STRING, allowNull: true }
    };
    
    

    return sequelize.define('Bahnhof', attributes);
}