const axios = require('axios')
const FormData = require("form-data");
const {Op} = require("sequelize");
let config = require('../config')
let dbconfig = config.database.postgres;

//批量更新HER和UT的Corrosion Allowance、Design Factor参数
async function execute() {
    let db = await require('../database')(
        dbconfig.dbname,
        dbconfig.username,
        dbconfig.password,
        dbconfig.config
    )
    const ModelInstance = db.models.model_instance
    let instances = await ModelInstance.findAll({
        where: {
            modelId: {
                [Op.in]: ["ef174ca8-c75b-4434-936a-14699eb2168c"]
            }
        }
    })

    const well_type_list = [{
        "Type": "Sour",
        "Wells": "MJ0002"
    },
        {
            "Type": "Sour",
            "Wells": "MJ0003"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0005"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0006"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0008"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0010"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0014"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0016"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0017"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0020"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0022"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0001"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0015"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0018"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0027"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0047"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0048"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0049"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0050"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0051"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0072"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0078"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0075"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0069"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0082"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0086"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0087"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0004"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0019"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0036"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0043"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0056"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0057"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0032"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0046"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0028"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0034"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0058"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0060"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0061"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0063"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0011"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0033"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0031"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0035"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0039"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0040"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0052"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0053"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0054"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0055"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0037"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0042"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0044"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0029"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0030"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0038"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0041"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0045"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0066"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0064"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0062"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0059"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0070"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0073"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0068"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0077"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0071"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0074"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0079"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0076"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0080"
        },
        {
            "Type": "Sour",
            "Wells": "MJ0081"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0083"
        },
        {
            "Type": "Sweet",
            "Wells": "MJ0085"
        }]

    let well_type_dict = {}
    well_type_list.map(e=>{
        well_type_dict[e.Wells] = e.Type
    })
    // console.log(well_type_dict)

    instances.map(instance => {
        //console.log(instance.instanceId, "Updating...")
        let instanceId = instance.instanceId

        const well_name = instanceId.replace("-", "00")
        if(well_name in well_type_dict){
            let host = config.server.public
            let path = '/instance/' + instanceId + '/data/attributes'

            let form = new FormData()
            form.append("Well Type", well_type_dict[well_name])

            axios.post(host + path, form, {
                headers: {
                    'Content-Type': 'multipart/form-data; boundary=' + form.getBoundary()
                }
            })
                .then((response) =>
                    console.log(response.data));
        }else {
            console.log(`Not found well type for ${instanceId}, skipping`)
        }
    })
}

execute()



