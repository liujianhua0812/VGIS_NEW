const {messages} = require("../../../libs/Error");
const Sequelize = require('sequelize')
const Meta = require('../../../database/models/metas')

exports.showField = async (ctx, next) => {
    try {
        const TableField = global.db.models.table_field
        return ctx.body = {
            data: await TableField.findAll({
                where:{
                    tableId: ctx.params.tableId
                }
            })
        }
    }catch (err){
        console.log(err)
        throw new Error(messages.controller.table.DATA_INTERFACE_ERROR)
    }
}

exports.createField = async (ctx, next) => {
    try {
        const DataTable = global.db.models.data_table
        const TableField = global.db.models.table_field
        let tableField = await TableField.create(Object.assign({}, ctx.params, ctx.request.body))
        let queryInterface = global.db.getQueryInterface()
        await queryInterface.addColumn(Meta.getTableId(tableField.tableId), Meta.getFieldId(tableField.id), Meta.defineField(tableField))
        await Meta.defineOne(global.db, Sequelize.DataTypes, await DataTable.findByPk(ctx.params.tableId, {
            include: [TableField]
        }))
        await global.db.sync()
        return ctx.body = {
            data: tableField
        }
    }catch (err){
        console.log(err)
        throw new Error(messages.controller.table.DATA_INTERFACE_ERROR)
    }
}

exports.updateField = async (ctx, next) => {
    try {
        const DataTable = global.db.models.data_table
        const TableField = global.db.models.table_field
        const [updatedRows] = await TableField.update(
            ctx.request.body,
            {
                where: {
                    id: ctx.params.fieldId,
                    tableId: ctx.params.tableId
                }
            }
        )
        let field = await TableField.findOne({
            where: {
                id: ctx.params.fieldId,
                tableId: ctx.params.tableId
            }
        })
        let queryInterface = global.db.getQueryInterface()
        await queryInterface.changeColumn(Meta.getTableId(field.tableId), Meta.getFieldId(field.id), Meta.defineField(field))
        if (!field.unique) {
            await queryInterface.removeConstraint(Meta.getTableId(field.tableId), Meta.getUniqueKeyId(field.tableId, field.id))
        }
        else {
            await queryInterface.addConstraint(Meta.getTableId(field.tableId), {
                name: Meta.getUniqueKeyId(field.tableId, field.id),
                type: "UNIQUE",
                fields: [Meta.getFieldId(field.id)]
            })
        }
        await Meta.defineOne(global.db, Sequelize.DataTypes, await DataTable.findByPk(ctx.params.tableId, {
            include: [TableField]
        }))
        await global.db.sync()
        if(updatedRows === 1){
            return ctx.body = {
                code: 1,
                msg: "Updated successfully"
            }
        }else {
            return ctx.body = {
                code: -1,
                msg: "ERROR! Update Failed."
            }
        }
    } catch (err) {
        console.log(err)
        throw new Error(messages.controller.table.DATA_INTERFACE_ERROR)
    }
}

exports.destroyField = async (ctx, next) => {
    try{
        const DataTable = global.db.models.data_table
        const TableField = global.db.models.table_field
        const deletedRecord = await TableField.destroy({
            where: {
                id: ctx.params.fieldId,
                tableId: ctx.params.tableId
            }
        })
        let queryInterface = global.db.getQueryInterface()
        await queryInterface.removeColumn(Meta.getTableId(ctx.params.tableId), Meta.getFieldId(ctx.params.fieldId))
        await Meta.defineOne(global.db, Sequelize.DataTypes, await DataTable.findByPk(ctx.params.tableId, {
            include: [TableField]
        }))
        await global.db.sync()
        if(deletedRecord===1){
            return ctx.body = {
                code: 1,
                msg: "Deleted successfully"
            }
        }else {
            return ctx.body = {
                code: -1,
                msg: "Record Not Found"
            }
        }
    }catch (err) {
        console.log(err)
        throw new Error(messages.controller.table.DATA_INTERFACE_ERROR)
    }
}
