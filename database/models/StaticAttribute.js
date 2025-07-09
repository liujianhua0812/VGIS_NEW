const Sequelize = require('sequelize')
/**
 * 模型静态属性的定义
 */
module.exports = function (sequelize, DataTypes) {
    const splitter = '|-|*|&|^|'
    return sequelize.define('static_attribute', {
        id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        modelId: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        rank: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        dataType: {
            type: DataTypes.ENUM('String', 'Text', 'Enum', 'Integer', 'Decimal', 'Date', 'Time', 'DateTime', 'Boolean'),
            allowNull: false,
            defaultValue: 'String'
        },
        required: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        unique: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        min: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        max: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        precision: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        unitId: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        candidateStr: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        candidate: {
            type: DataTypes.VIRTUAL,
            get () {
                let str = this.getDataValue('candidateStr')
                if (str) {
                    return str.split(splitter)
                }
                return []
            },
            set (value) {
                this.setDataValue('candidateStr', value.join(splitter))
            }
        },
        defaultValue: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        useRealTime: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
    }, {
        timestamps: true
    });
};
