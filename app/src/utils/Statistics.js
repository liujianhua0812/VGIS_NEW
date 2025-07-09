
export function calculateUpperAndLowerBound (records) {
    let max = Math.max(...records)
    let min = Math.min(...records)
    let lower = 0, upper = 0
    if (min === max) {
        lower = upper = "auto"
    }
    else {
        lower = min - (max - min) * 0.1
        upper = max + (max - min) * 0.1
    }
    return {
        upper, lower
    }
}

export function getSteamToElectricityFactor (steamLevel) {
    let map = {
        "10.0Mpa": 1.0692,
        "5.0Mpa": 1.0464,
        "3.5Mpa": 1.0228,
        "2.5Mpa": 0.9878,
        "1.5Mpa": 0.9300,
        "1.0Mpa": 0.8828,
        "0.7Mpa": 0.8373,
        "0.3Mpa": 0.7673,
        "<0.3Mpa": 0.6395,
    }
    return map[steamLevel] || map["0.7Mpa"]
}

export function getEnergy (electricity = 0, gas = 0, water = 0, steam = 0, steamLevel) {
    const GAS_FACTOR = 10.8218
    const WATER_FACTOR = 0.6973
    const STEAM_FACTOR = getSteamToElectricityFactor(steamLevel) * 1000
    return electricity + gas * GAS_FACTOR + water * WATER_FACTOR + steam * STEAM_FACTOR
}

export function getQuartile (values) {
    values = values.sort((i1, i2) => i1 - i2)
    if (values.length === 0) {
        return [null, null, null, null, null]
    }
    let size = values.length - 1
    return [
        values[0],
        values[Math.round(size / 4)],
        values[Math.round(size / 2)],
        values[Math.round(size * 3 / 4)],
        values[size]
    ]
}

export function toFixedValue(value, precision) {
    let _value = parseFloat(value)
    if (isNaN(_value)) {
        return value
    }
    return parseFloat(_value.toFixed(precision))
}

export function calculateCarbon (factors, records) {
    if (factors.length === 0) {
        return 0
    }
    let index = 0, sIndex = 0, eIndex = 0, sum = 0
    for(let i = 0; i < records.length; i++) {
        let record = records[i]
        // 如果当前记录的时间早于当前价格的起始时间，则顺次找到第一个能使当前价格落入价格时间范围的价格记录，并记下对应时间点的记录，作为起始记录
        if (record.time < factors[index].startAt) {
            while(index < factors.length && record.time < factors[index].startAt) {
                index++
            }
            if (index >= factors.length) {
                break
            }
            else {
                sIndex = i
            }
        }
        // 如果当前记录的时间晚于当前价格的结束时间，则用当前记录和之前的起始记录（如果有）计算一次能耗价格
        else if (record.time > factors[index].endAt) {
            sum += (records[eIndex].value - records[sIndex].value) * factors[index].value
        }
        else if (i === records.length - 1) {
            sum += (records[i].value - records[sIndex].value) * factors[index].value
        }
        else {
            eIndex = i
        }
    }
    return sum
}

export function getGapRatio(value1, value2, precision = 2) {
    let gap = value1 - value2
    if (value2 === 0) {
        return 0
    }
    else {
        return toFixedValue(gap / value2 * 100, precision)
    }
}

export function calculateEnergyCost (prices, records) {
    if (prices.length === 0) {
        return 0
    }
    let index = 0, sIndex = 0, eIndex = 0, sum = 0
    for(let i = 0; i < records.length; i++) {
        let record = records[i]
        // 如果当前记录的时间早于当前价格的起始时间，则顺次找到第一个能使当前价格落入价格时间范围的价格记录，并记下对应时间点的记录，作为起始记录
        if (record.time < prices[index].startAt) {
            while(index < prices.length && record.time < prices[index].startAt) {
                index++
            }
            if (index >= prices.length) {
                break
            }
            else {
                sIndex = i
            }
        }
        // 如果当前记录的时间晚于当前价格的结束时间，则用当前记录和之前的起始记录（如果有）计算一次能耗价格
        if (record.time > prices[index].endAt) {
            sum += (records[eIndex].value - records[sIndex].value) * prices[index].price
        }
        else if (i === records.length - 1) {
            sum += (records[i].value - records[sIndex].value) * prices[index].price
        }
        else {
            eIndex = i
        }
    }
    return sum
}

export function calculateElectricityCost (prices, records) {
    let priceMap = prices.reduce((result, price) => {
        let month = price.month.format("yyyy-MM")
        let data = {}
        for(let i = 0; i < 24; i++) {
            data[i] = price[`price_${i}`]
        }
        result[month] = data
        return result
    }, {})
    let sum = 0
    for(let i = 1; i <records.length; i++) {
        let prev = records[i - 1], curr = records[i]
        let prevTime = new Date(prev.time.getFullYear(), prev.time.getMonth(), prev.time.getDate(), prev.time.getHours())
        let currTime = new Date(curr.time.getFullYear(), curr.time.getMonth(), curr.time.getDate(), curr.time.getHours())
        let currMonth = curr.time.format("yyyy-MM")
        let currHour = curr.time.getHours()
        if (currTime - prevTime === 60 * 60 * 1000 && priceMap[currMonth] && priceMap[currMonth][currHour]) {
            sum += (curr.value - prev.value) * priceMap[currMonth][currHour]
        }
    }
    return sum
}