const {messages} = require("../../../libs/Error");

exports.showRelation = async (ctx, next) => {
    try {
        const TableRelation = global.db.models.table_relation
        const TableField = global.db.models.table_field
        const Model = global.db.models.model
        const ModelInstance = global.db.models.model_instance
        const Unit = global.db.models.unit

        let queryResult = await TableRelation.findAll({
            where:{
                tableId: ctx.params.tableId
            },
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
        })

        let result = []
        for (let relation of queryResult) {
            result.push({
                id: relation.id,
                tableId: relation.tableId,
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

exports.createRelation = async (ctx, next) => {
    try {
        const TableRelation = global.db.models.table_relation
        let tableRelation = await TableRelation.create(Object.assign({}, ctx.params, ctx.request.body))
        return ctx.body = {
            data: tableRelation
        }
    }catch (err){
        console.log(err)
        throw new Error(messages.controller.table.DATA_INTERFACE_ERROR)
    }
}

exports.updateRelation = async (ctx, next) => {
    try {
        const TableRelation = global.db.models.table_relation
        const [updatedRows] = await TableRelation.update(
            ctx.request.body,
            {
                where: {
                    id: ctx.params.relationId,
                    tableId: ctx.params.tableId
                }
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
    }catch (err){
        console.log(err)
        throw new Error(messages.controller.table.DATA_INTERFACE_ERROR)
    }
}

exports.destroyRelation = async (ctx, next) => {
    try{
        const TableRelation = global.db.models.table_relation
        const deletedRecord = await TableRelation.destroy({
            where: {
                id: ctx.params.relationId,
                tableId: ctx.params.tableId
            }
        })
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