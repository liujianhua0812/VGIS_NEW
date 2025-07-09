const {messages} = require("../../libs/Error");
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const Meta = require('../../database/models/metas')

exports.index = async (ctx, next) => {
    const DataTable = global.db.models.data_table

    let query = {}
    if (ctx.request.query.query) {
        query = {
            name: {
                [Op.iLike]: `%${ctx.request.query.query.split('').join('%')}%`
            }
        }
    }

    return ctx.body = {
        data: await DataTable.findAll({
            where: query,
            order: [['name', "ASC"]]
        })
    }
}

exports.show = async (ctx, next) => {
    try {
        const DataTable = global.db.models.data_table
        const TableField = global.db.models.table_field
        const TableRelation = global.db.models.table_relation
        const Model = global.db.models.model
        const ModelInstance = global.db.models.model_instance
        const Unit = global.db.models.unit

        let queryResult = await DataTable.findOne({
            where: {
                id: ctx.params.tableId
            },
            include: [
                {model: TableField},
                {
                    model: TableRelation,
                    include: [
                        {
                            model: TableField,
                            include: [Unit]
                        },
                        {
                            model: Model,
                            include: [{
                                model: ModelInstance
                            }]
                        }
                    ]
                }
            ]
        })

        let result = {
            id: queryResult.id,
            name: queryResult.name,
            table_fields: queryResult.table_fields,
            table_relations: []
        }
        for (let relation of queryResult.table_relations) {
            result.table_relations.push({
                relationId: relation.id,
                modelUUID: relation.modelId,
                modelId: relation.model.modelId,
                modelName: relation.model.name,
                fieldId: relation.fieldId,
                table_field: relation.table_field,
                instanceNum: relation.model.model_instances.length
            })
        }

        return ctx.body = {
            data: result
        }
    }catch (err){
        console.log(err)
        throw new Error(messages.controller.table.DATA_INTERFACE_ERROR)
    }
}

exports.create = async (ctx, next) => {
    try {
        const DataTable = global.db.models.data_table
        let dataTable = await DataTable.create(ctx.request.body)
        await Meta.defineOne(global.db, Sequelize.DataTypes, dataTable)
        await global.db.sync()
        return ctx.body = {
            data: dataTable
        }
    }catch (err){
        console.log(err)
        throw new Error(messages.controller.table.DATA_INTERFACE_ERROR)
    }
}

exports.update = async (ctx, next) => {
    try {
        const DataTable = global.db.models.data_table
        const [updatedRows] = await DataTable.update(
            ctx.request.body,
            {
                where: { id: ctx.params.tableId },
            }
        )
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

exports.destroy = async (ctx, next) => {
    try{
        const DataTable = global.db.models.data_table
        const deletedRecord = await DataTable.destroy({
            where: { id: ctx.params.tableId },
        })
        await global.db.models[Meta.getTableId(ctx.params.tableId)].drop()
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

exports.field = require('./field')

exports.relation = require('./relation')

exports.record = require('./record')
