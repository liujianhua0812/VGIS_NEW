const Sequelize = require('sequelize')
/**
 * 电价
 */
module.exports = function (sequelize, DataTypes) {

    let schema = {
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        month: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }

    for(let i = 0; i < 24; i++) {
        schema[`price_${i}`] = {
            type: DataTypes.DOUBLE,
            allowNull: false
        }
    }

    return sequelize.define('electricity_price', schema, {
        timestamps: true
    });
};
