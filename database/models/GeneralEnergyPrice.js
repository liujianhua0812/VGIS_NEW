const Sequelize = require('sequelize')
/**
 * 通用能源价格（水、天然气、蒸汽）
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('general_energy_price', {
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        startAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        endAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        energy: {
            type: DataTypes.ENUM("水", "天然气", "蒸汽"),
            allowNull: false
        }
    }, {
        timestamps: true
    });
};
