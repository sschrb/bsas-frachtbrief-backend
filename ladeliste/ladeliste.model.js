const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        /*
        adresse: { type: DataTypes.STRING, allowNull: false },
        wagenummer: { type: DataTypes.STRING, allowNull: false },
        pdf_id: { type: DataTypes.INTEGER, allowNull: true },
        bahnhof: { type: DataTypes.STRING, allowNull: false },
        bahnhofscode: { type: DataTypes.STRING, allowNull: false },
        land: { type: DataTypes.STRING, allowNull: false },
        laendercode: { type: DataTypes.STRING, allowNull: false }
        */
       ladelistedata: {type: DataTypes.JSON },
       pdf_id: { type: DataTypes.INTEGER, allowNull: true },
       status: { type: DataTypes.STRING, allowNull: true },
       vorlage: { type: DataTypes.STRING, allowNull: true },
        
    };

   

    return sequelize.define('Ladeliste', attributes);
}