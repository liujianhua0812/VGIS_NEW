
function getChiller (name) {
    return {
        id: Math.random(),
        label: name,
        type: "device"
    }
}

function getFreezingPump (name) {
    return {
        id: Math.random(),
        label: name,
        type: "device"
    }
}

function getCoolingPump (name) {
    return {
        id: Math.random(),
        label: name,
        type: "device"
    }
}

function getCoolingTower (name) {
    return {
        id: Math.random(),
        label: name,
        type: "device"
    }
}

function getCoolingStation (name) {
    return {
        id: Math.random(),
        label: name,
        type: "facility",
        children: [{
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
            type: "device"
        }, {
            id: Math.random(),
            label: "冷冻水系统",
            type: "facility"
        }, {
            id: Math.random(),
            label: "冷却水系统",
            type: "facility"
        }]
    }
}

function getAirCompressor (name) {
    return {
        id: Math.random(),
        label: name,
        type: "device"
    }
}

function getDryer (name) {
    return {
        id: Math.random(),
        label: name,
        type: "device"
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

export default [getCoolingStation("冷站"), getAirCompressionStation("空压站")]