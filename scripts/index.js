
let axios = require('axios')

let tags = [
    "B.MJ.CP1.CP000-61-A-001A",
    "B.MJ.CP1.CP000-61-T-001",
    "B.MJ.CP1.CP000-61-T-002",
    "B.MJ.CP1.CP000-44-V-001",
    "B.MJ.CP1.CP000-51-V-001",
    "B.MJ.CP1.CP000-51-H-001",
    "B.MJ.CP1.CP000-44-P-001A",
    "B.MJ.CP1.CP000-44-P-001B",
    "B.MJ.CP1.CP000-44-P-001C",
    "B.MJ.CP1.CP001-27-E-001",
    "B.MJ.CP1.CP001-27-E-002",
    "B.MJ.CP1.CP002-27-E-001",
    "B.MJ.CP1.CP002-27-E-002",
    "B.MJ.CP1.CP002-50-E-001A",
    "B.MJ.CP1.CP002-50-E-001B",
    "B.MJ.CP1.CP000-42-A-001",
    "B.MJ.CP1.CP000-41-A-001",
    "B.MJ.CP1.CP000-43-A-001",
    "B.MJ.CP1.CP000-51-A-003",
    "B.MJ.CP1.CP000-51-E-003A",
    "B.MJ.CP1.CP000-51-E-003B",
    "B.MJ.CP1.CP000-56-A-001",
    "B.MJ.CP1.CP000-51-K-001A",
    "B.MJ.CP1.CP000-51-K-001B",
    "B.MJ.CP1.CP000-53-P-001A",
    "B.MJ.CP1.CP000-53-P-001B",
    "B.MJ.CP1.CP000-52-V-002",
    "B.MJ.CP1.CP000-52-P-001A",
    "B.MJ.CP1.CP000-52-P-001B",
    "B.MJ.CP1.CP000-52-T-001",
    "B.MJ.CP1.CP000-24-P-002A",
    "B.MJ.CP1.CP000-24-P-002B",
    "B.MJ.CP1.CP000-24-P-002C",
    "B.MJ.CP1.CP000-24-P-006A",
    "B.MJ.CP1.CP000-24-P-006B",
    "B.MJ.CP1.CP000-48-P-007A",
    "B.MJ.CP1.CP000-48-P-007B",
    "B.MJ.CP1.CP002-27-P-001A",
    "B.MJ.CP1.CP002-27-P-001B",
    "B.MJ.CP1.CP002-27-P-002A",
    "B.MJ.CP1.CP002-27-P-002B",
    "B.MJ.CP1.CP002-48-P-001A",
    "B.MJ.CP1.CP002-48-P-001B",
    "B.MJ.CP1.CP001-27-P-001A",
    "B.MJ.CP1.CP001-27-P-001B",
    "B.MJ.CP1.CP001-27-P-002A",
    "B.MJ.CP1.CP001-27-P-002B",
    "B.MJ.CP1.CP001-48-P-001A",
    "B.MJ.CP1.CP001-48-P-001B"
]

let config = require('../config')

async function test() {
    let client = axios.create({
        baseURL: config.oa.host,
    })

    for(let i = 0; i < tags.length; i++) {
        let data =  (await client({
            url: `/api/cm/equipment/list`,
            method: 'get',
            params: {
                STRNO: tags[i]
            }
        })).data
        console.log(tags[i], data.api_datas.list[0] ? 'true' : 'false')
    }
}

test()

