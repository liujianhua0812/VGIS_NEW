
function getChiller (name) {
    return {
        id: Math.random(),
        label: name,
        type: "device",
        children: [{
            id: Math.random(),
            label: "运行状态",
            type: "point"
        }, {
            id: Math.random(),
            label: "COP",
            type: "point"
        }, {
            id: Math.random(),
            label: "功率",
            type: "point"
        }, {
            id: Math.random(),
            label: "冷冻水供水温度",
            type: "point"
        }, {
            id: Math.random(),
            label: "冷冻水回水温度",
            type: "point"
        }, {
            id: Math.random(),
            label: "冷冻水流量",
            type: "point"
        }, {
            id: Math.random(),
            label: "蒸发温度",
            type: "point"
        }, {
            id: Math.random(),
            label: "冷却水供水温度",
            type: "point"
        }, {
            id: Math.random(),
            label: "冷却水回水温度",
            type: "point"
        }, {
            id: Math.random(),
            label: "冷却水流量",
            type: "point"
        }, {
            id: Math.random(),
            label: "冷凝温度",
            type: "point"
        }, {
            id: Math.random(),
            label: "IGV开度",
            type: "point"
        }, {
            id: Math.random(),
            label: "频率",
            type: "point"
        }]
    }
}

function getFreezingPump (name) {
    return {
        id: Math.random(),
        label: name,
        type: "device",
        children: [{
            id: Math.random(),
            label: "运行状态",
            type: "point"
        }, {
            id: Math.random(),
            label: "功率",
            type: "point"
        }, {
            id: Math.random(),
            label: "扬程",
            type: "point"
        }, {
            id: Math.random(),
            label: "频率",
            type: "point"
        }, {
            id: Math.random(),
            label: "效率",
            type: "point"
        }, {
            id: Math.random(),
            label: "水泵前压力",
            type: "point"
        }, {
            id: Math.random(),
            label: "水泵后压力",
            type: "point"
        }]
    }
}

function getCoolingPump (name) {
    return {
        id: Math.random(),
        label: name,
        type: "device",
        children: [{
            id: Math.random(),
            label: "运行状态",
            type: "point"
        }, {
            id: Math.random(),
            label: "功率",
            type: "point"
        }, {
            id: Math.random(),
            label: "扬程",
            type: "point"
        }, {
            id: Math.random(),
            label: "频率",
            type: "point"
        }, {
            id: Math.random(),
            label: "效率",
            type: "point"
        }, {
            id: Math.random(),
            label: "水泵前压力",
            type: "point"
        }, {
            id: Math.random(),
            label: "水泵后压力",
            type: "point"
        }]
    }
}

function getCoolingTower (name) {
    return {
        id: Math.random(),
        label: name,
        type: "device",
        children: [{
            id: Math.random(),
            label: "运行状态",
            type: "point"
        }, {
            id: Math.random(),
            label: "出水温度",
            type: "point"
        }, {
            id: Math.random(),
            label: "风机频率",
            type: "point"
        }]
    }
}

function getCoolingStation (name) {
    return {
        id: Math.random(),
        label: name,
        type: "facility",
        children: [{
            id: Math.random(),
            label: "EER",
            type: "point"
        }, {
            id: Math.random(),
            label: "COP",
            type: "point"
        }, {
            id: Math.random(),
            label: "冷冻水WTF",
            type: "point"
        }, {
            id: Math.random(),
            label: "冷却水WTF",
            type: "point"
        }, {
            id: Math.random(),
            label: "供冷量",
            type: "point"
        }, {
            id: Math.random(),
            label: "用电量",
            type: "point"
        }, {
            id: Math.random(),
            label: "冷机",
            type: "category",
            children: [
                getChiller("1#冷机"),
                getChiller("2#冷机"),
                getChiller("3#冷机"),
                getChiller("4#冷机"),
            ]
        }, {
            id: Math.random(),
            label: "冷冻泵",
            type: "category",
            children: [
                getFreezingPump("1#冷冻泵"),
                getFreezingPump("2#冷冻泵"),
                getFreezingPump("3#冷冻泵"),
                getFreezingPump("4#冷冻泵"),
            ]
        }, {
            id: Math.random(),
            label: "冷却泵",
            type: "category",
            children: [
                getCoolingPump("1#冷却泵"),
                getCoolingPump("2#冷却泵"),
                getCoolingPump("3#冷却泵"),
                getCoolingPump("4#冷却泵"),
            ]
        }, {
            id: Math.random(),
            label: "冷却塔",
            type: "category",
            children: [
                getCoolingTower("1#冷却塔"),
                getCoolingTower("2#冷却塔"),
                getCoolingTower("3#冷却塔"),
                getCoolingTower("4#冷却塔"),
            ]
        }, {
            id: Math.random(),
            label: "分集水器",
            type: "device",
            children: [{
                id: Math.random(),
                label: "分水器压力",
                type: "point",
            }, {
                id: Math.random(),
                label: "回水器压力",
                type: "point",
            }, {
                id: Math.random(),
                label: "旁通阀开度",
                type: "point",
            }]
        }, {
            id: Math.random(),
            label: "冷冻水系统",
            type: "facility",
            children: [{
                id: Math.random(),
                label: "总管供水温度",
                type: "point",
            }, {
                id: Math.random(),
                label: "总管回水温度",
                type: "point",
            }, {
                id: Math.random(),
                label: "总管流量",
                type: "point",
            }, {
                id: Math.random(),
                label: "最不利1#回路回水温度",
                type: "point",
            }, {
                id: Math.random(),
                label: "最不利2#回路回水温度",
                type: "point",
            }, {
                id: Math.random(),
                label: "最不利1#回路供水压力",
                type: "point",
            }, {
                id: Math.random(),
                label: "最不利1#回路回水压力",
                type: "point",
            }, {
                id: Math.random(),
                label: "最不利2#回路供水压力",
                type: "point",
            }, {
                id: Math.random(),
                label: "最不利2#回路回水压力",
                type: "point",
            }, {
                id: Math.random(),
                label: "冷机供水压力",
                type: "point",
            }, {
                id: Math.random(),
                label: "冷机回水压力",
                type: "point",
            }]
        }, {
            id: Math.random(),
            label: "冷却水系统",
            type: "facility",
            children: [{
                id: Math.random(),
                label: "总管供水温度",
                type: "point",
            }, {
                id: Math.random(),
                label: "总管回水温度",
                type: "point",
            }, {
                id: Math.random(),
                label: "总管流量",
                type: "point",
            }, {
                id: Math.random(),
                label: "冷机供水压力",
                type: "point",
            }, {
                id: Math.random(),
                label: "冷机回水压力",
                type: "point",
            }]
        }]
    }
}

function getAirCompressor (name) {
    return {
        id: Math.random(),
        label: name,
        type: "device",
        children: [{
            id: Math.random(),
            label: "运行状态",
            type: "point",
        }, {
            id: Math.random(),
            label: "排气压力",
            type: "point",
        }, {
            id: Math.random(),
            label: "排气温度",
            type: "point",
        }, {
            id: Math.random(),
            label: "运行频率",
            type: "point",
        }, {
            id: Math.random(),
            label: "入口真空",
            type: "point",
        }, {
            id: Math.random(),
            label: "入口温度",
            type: "point",
        }]
    }
}

function getDryer (name) {
    return {
        id: Math.random(),
        label: name,
        type: "device",
        children: [{
            id: Math.random(),
            label: "运行状态",
            type: "point",
        }, {
            id: Math.random(),
            label: "冷却水进水温度",
            type: "point",
        }, {
            id: Math.random(),
            label: "冷却水出水温度",
            type: "point",
        }]
    }
}

function getAirCompressionStation (name) {
    return {
        id: Math.random(),
        label: name,
        type: "facility",
        children: [{
            id: Math.random(),
            label: "空压机",
            type: "category",
            children: [
                getAirCompressor("1#空压机"),
                getAirCompressor("2#空压机"),
                getAirCompressor("3#空压机"),
                getAirCompressor("4#空压机"),
            ]
        }, {
            id: Math.random(),
            label: "干燥机",
            type: "category",
            children: [
                getDryer("1#干燥机"),
                getDryer("2#干燥机"),
                getDryer("3#干燥机"),
                getDryer("4#干燥机"),
            ]
        }]
    }
}

export default [{
    id: Math.random(),
    label: "能源",
    type: "category",
    expanded: true,
    children: [{
        id: Math.random(),
        label: "总能耗",
        type: "point"
    }, {
        id: Math.random(),
        label: "能耗强度",
        type: "point"
    }, {
        id: Math.random(),
        label: "电",
        type: "category",
        children: [{
            id: Math.random(),
            label: "总用电",
            type: "point"
        }, {
            id: Math.random(),
            label: "车间",
            type: "point"
        }, {
            id: Math.random(),
            label: "冷站",
            type: "point"
        }, {
            id: Math.random(),
            label: "空压站",
            type: "point"
        }, {
            id: Math.random(),
            label: "制氮机",
            type: "point"
        }, {
            id: Math.random(),
            label: "纯水机",
            type: "point"
        }, {
            id: Math.random(),
            label: "锅炉房",
            type: "point"
        }]
    }, {
        id: Math.random(),
        label: "天然气",
        type: "point"
    }, {
        id: Math.random(),
        label: "蒸汽",
        type: "point"
    }, {
        id: Math.random(),
        label: "水",
        type: "point"
    }, {
        id: Math.random(),
        label: "光伏发电",
        type: "point"
    }, {
        id: Math.random(),
        label: "能源费用",
        type: "point"
    }],
}, getCoolingStation("冷站"), getAirCompressionStation("空压站")]