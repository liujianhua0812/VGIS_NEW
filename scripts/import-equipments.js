
const fs = require('fs').promises
const path = require('path')
let config = require('../config')
let dbconfig = config.database.postgres;

async function execute () {
    let db = await require('../database')(
        dbconfig.dbname,
        dbconfig.username,
        dbconfig.password,
        dbconfig.config
    )

    let Model = db.models.model
    let Instance = db.models.model_instance


    let MODEL_NAME = "FanCoilUnit"
    let model = await Model.findOne({
        where: {
            modelId: MODEL_NAME
        }
    })
    await Instance.destroy({
        where: {
            modelId: model.id
        }
    })
    let ids = []

    // FCU（风机盘管）——1F
    for(let i = 1; i <= 101; i++) {
        if (i === 63) {}
        else if (i < 100) {
            ids.push(`FCU_1F_${`${i}`.padStart(2, "0")}`)
        }
        else {
            ids.push(`FCU_1F_${i}`)
        }
    }
    // FCU（风机盘管）——1FJ
    for(let i = 1; i <= 19; i++) {
        ids.push(`FCU_1FJ_${`${i}`.padStart(2, "0")}`)
    }
    // FCU（风机盘管）——2F
    for(let i = 1; i <= 6; i++) {
        ids.push(`FCU_2F_${`${i}`.padStart(2, "0")}`)
    }
    // FCU（风机盘管）——2FJ
    for(let i = 1; i <= 3; i++) {
        ids.push(`FCU_2FJ_${`${i}`.padStart(2, "0")}`)
    }
    // FCU（风机盘管）——B2F
    for(let i = 1; i <= 81; i++) {
        ids.push(`FCU_B2F_${`${i}`.padStart(2, "0")}`)
    }

    await Instance.bulkCreate(ids.map((id, index) => ({
        name: id,
        instanceId: id,
        modelId: model.id,
        published: true,
        rank: index
    })))
    console.log(`Stadium equipment 【${MODEL_NAME}】 loaded.`)

    MODEL_NAME = "AirConditionSensor"
    model = await Model.findOne({
        where: {
            modelId: MODEL_NAME
        }
    })
    await Instance.destroy({
        where: {
            modelId: model.id
        }
    })
    ids = []

    // 空气质量
    for(let i = 1; i <= 2; i++) {
        ids.push(`B1HJ0${i}`)
    }
    for(let i = 3; i <= 28; i++) {
        ids.push(`B1HJ${i}`)
    }
    ids.push("B1JHJ01")
    for(let i = 1; i <= 31; i++) {
        ids.push(`B2HJ${`${i}`.padStart(2, "0")}`)
    }
    for(let i = 1; i <= 6; i++) {
        ids.push(`HJ_1F_${i}`)
    }
    for(let i = 1; i <= 6; i++) {
        ids.push(`HJ_2F_${i}`)
    }

    await Instance.bulkCreate(ids.map((id, index) => ({
        name: id,
        instanceId: id,
        modelId: model.id,
        published: true,
        rank: index
    })))
    console.log(`Stadium equipment 【${MODEL_NAME}】 loaded.`)

    MODEL_NAME = "AirHandlingUnit"
    model = await Model.findOne({
        where: {
            modelId: MODEL_NAME
        }
    })
    await Instance.destroy({
        where: {
            modelId: model.id
        }
    })
    ids = [
        "AHU_2F_1",
        "AHU_2F_2",
        "AHU_3F_1",
        "AHU_3F_2",
        "AHU_B1_2",
        "AHU_B1_3",
        "AHU_B1_4",
        "AHU_B1_5",
        "AHU_B1_7",
        "AHU_B1_9",
        "AHU_B2_2",
        "AHU_B2_3",
        "AHU_B2_5",
        "AHU_B2_6",
        "AHU_B21_1",
        "AHU_B21_2",
        "AHU_JC_1"
    ]

    await Instance.bulkCreate(ids.map((id, index) => ({
        name: id,
        instanceId: id,
        modelId: model.id,
        published: true,
        rank: index
    })))
    console.log(`Stadium equipment 【${MODEL_NAME}】 loaded.`)

    MODEL_NAME = "Elevator"
    model = await Model.findOne({
        where: {
            modelId: MODEL_NAME
        }
    })
    await Instance.destroy({
        where: {
            modelId: model.id
        }
    })
    ids = []

    for(let i = 1; i <= 11; i++) {
        ids.push(`DT${`${i}`.padStart(2, "0")}`)
    }

    await Instance.bulkCreate(ids.map((id, index) => ({
        name: id,
        instanceId: id,
        modelId: model.id,
        published: true,
        rank: index
    })))
    console.log(`Stadium equipment 【${MODEL_NAME}】 loaded.`)

    // 排风机
    MODEL_NAME = "ExhaustAirFan"
    model = await Model.findOne({
        where: {
            modelId: MODEL_NAME
        }
    })
    await Instance.destroy({
        where: {
            modelId: model.id
        }
    })
    ids = [
        "EAF_B12_1",
        "EAF_B13_1",
        "EAF_B14_1",
        "EAF_B15_1",
        "EAF_B16_1",
        "EAF_B17_1",
        "EAF_B18_1",
        "EAF_B19_1",
        "EAF_B110_1",
        "EAF_B21_1",
        "EAF_B21_2",
        "EAF_B21_3",
        "EAF_B21_4",
        "EAF_B21_5",
        "EAF_B23_1",
        "EAF_B23_2",
        "EAF_B24_1",
        "EAF_B24_2",
        "EAF_B25_1",
        "EAF_B26_1",
        "EAF_B27_1",
        "EAF_B28_1",
        "EAF_B29_1",
        "EAF_B210_1",
        "EAF_B211_1",
        "EAF_JC_1",
        "EAF_JC_2",
        "EAF_WC_1",
        "EAF_WC_2",
        "EAF_WC_4",
        "EAF_WC_5",
        "EAF_WC_6",
        "EAF_WC_7",
        "EAF_1F1_1",
        "EAF_1F2_1",
        "EAF_1F2_2",
        "EAF_3F1_1",
        "EAF_3F1_2",
    ]
    await Instance.bulkCreate(ids.map((id, index) => ({
        name: id,
        instanceId: id,
        modelId: model.id,
        published: true,
        rank: index
    })))
    console.log(`Stadium equipment 【${MODEL_NAME}】 loaded.`)

    // // 热水循环变频泵组
    // MODEL_NAME = "HotwaterPumpGroup"
    // model = await Model.findOne({
    //     where: {
    //         modelId: MODEL_NAME
    //     }
    // })
    // await Instance.destroy({
    //     where: {
    //         modelId: model.id
    //     }
    // })
    // ids = [
    //     "HP_P1",
    //     "HP_P2",
    //     "HP_P3",
    //     "HP_P4",
    // ]
    // await Instance.bulkCreate(ids.map((id, index) => ({
    //     name: id,
    //     instanceId: id,
    //     modelId: model.id,
    //     published: true,
    //     rank: index
    // })))
    // console.log(`Stadium equipment 【${MODEL_NAME}】 loaded.`)
    //
    // // 热水循环变频泵
    // MODEL_NAME = "HotwaterPump"
    // model = await Model.findOne({
    //     where: {
    //         modelId: MODEL_NAME
    //     }
    // })
    // await Instance.destroy({
    //     where: {
    //         modelId: model.id
    //     }
    // })
    // ids = [
    //     "HP_P1_1",
    //     "HP_P1_2",
    //     "HP_P1_3",
    //     "HP_P2_1",
    //     "HP_P2_2",
    //     "HP_P3_1",
    //     "HP_P3_2",
    //     "HP_P4_1",
    //     "HP_P4_2",
    // ]
    // await Instance.bulkCreate(ids.map((id, index) => ({
    //     name: id,
    //     instanceId: id,
    //     modelId: model.id,
    //     published: true,
    //     rank: index
    // })))
    // console.log(`Stadium equipment 【${MODEL_NAME}】 loaded.`)

    // 集水井
    MODEL_NAME = "JSJ"
    model = await Model.findOne({
        where: {
            modelId: MODEL_NAME
        }
    })
    await Instance.destroy({
        where: {
            modelId: model.id
        }
    })
    ids = [
        "JSJ_B1_7_2",
        "JSJB1_8_1",
        "JSJB1J_8_1",
        "JSJB2_1_1",
        "JSJB2_1_2",
        "JSJB2_1_3",
        "JSJB2_2_1",
        "JSJB2_2_2",
        "JSJB2_3_1",
        "JSJB2_4_1",
        "JSJB2_5_1",
        "JSJB2_5_2",
        "JSJB2_6_1",
        "JSJB2_6_2",
        "JSJB2_7_1",
        "JSJB2_7_2",
        "JSJB2_8_1",
        "JSJB2_8_2",
        "JSJB2_9_1",
        "JSJB2_9_2",
        "JSJB2_9_3",
        "JSJB2_10_1",
        "JSJB2_10_2",
        "JSJB2_11_1",
        "JSJB2_11_2",
        "JSJB2_YB_2"
    ]

    await Instance.bulkCreate(ids.map((id, index) => ({
        name: id,
        instanceId: id,
        modelId: model.id,
        published: true,
        rank: index
    })))
    console.log(`Stadium equipment 【${MODEL_NAME}】 loaded.`)

    // 集水井污水泵
    MODEL_NAME = "SewerPump"
    model = await Model.findOne({
        where: {
            modelId: MODEL_NAME
        }
    })
    await Instance.destroy({
        where: {
            modelId: model.id
        }
    })

    let _ids = []
    for(let i = 0; i < ids.length; i++) {
        _ids.push(`${ids[i]}_SM1`)
        _ids.push(`${ids[i]}_SM2`)
    }
    ids = _ids

    await Instance.bulkCreate(ids.map((id, index) => ({
        name: id,
        instanceId: id,
        modelId: model.id,
        published: true,
        rank: index
    })))
    console.log(`Stadium equipment 【${MODEL_NAME}】 loaded.`)

    // 新风机
    MODEL_NAME = "PreCoolingAirUnit"
    model = await Model.findOne({
        where: {
            modelId: MODEL_NAME
        }
    })
    await Instance.destroy({
        where: {
            modelId: model.id
        }
    })
    ids = [
        "PAU_1F1_2",
        "PAU_1F2_1",
        "PAU_1F3_1",
        "PAU_2F1_1",
        "PAU_3F1_1",
        "PAU_B1_6",
        "PAU_B1_8",
        "PAU_B2_7",
        "PAU_B2_8",
        "PAU_B2_9",
        "PAU_B2_10",
        "PAU_B2_11"
    ]
    await Instance.bulkCreate(ids.map((id, index) => ({
        name: id,
        instanceId: id,
        modelId: model.id,
        published: true,
        rank: index
    })))
    console.log(`Stadium equipment 【${MODEL_NAME}】 loaded.`)

    // 送风机
    MODEL_NAME = "SupplyAirFan"
    model = await Model.findOne({
        where: {
            modelId: MODEL_NAME
        }
    })
    await Instance.destroy({
        where: {
            modelId: model.id
        }
    })
    ids = [
        "SAF_1F1_1",
        "SAF_B21_1",
        "SAF_B21_2",
        "SAF_B24_1",
        "SAF_JC_1",
        "SAF_JC_2"
    ]
    await Instance.bulkCreate(ids.map((id, index) => ({
        name: id,
        instanceId: id,
        modelId: model.id,
        published: true,
        rank: index
    })))
    console.log(`Stadium equipment 【${MODEL_NAME}】 loaded.`)

    // 卫生间污水
    MODEL_NAME = "WSJWS"
    model = await Model.findOne({
        where: {
            modelId: MODEL_NAME
        }
    })
    await Instance.destroy({
        where: {
            modelId: model.id
        }
    })
    ids = [
        "WS_B0_1",
        "WS_B1_1",
        "WS_B1_2",
        "WS_B2_1",
        "WS_B2_2a",
        "WS_B2_2b",
        "WS_B2_3",
        "WS_B2_4"
    ]
    await Instance.bulkCreate(ids.map((id, index) => ({
        name: id,
        instanceId: id,
        modelId: model.id,
        published: true,
        rank: index
    })))
    console.log(`Stadium equipment 【${MODEL_NAME}】 loaded.`)

    console.log("Stadium equipment loaded.")
}

execute()
