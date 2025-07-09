const fs = require('fs')
const path = require('path')
const DocPath = path.join(__dirname, "API-Doc-Template")

module.exports = {
    async generateFull (instance) {
        let System = global.db.models.system
        let setting = await System.findOne()
        let lang = "en"
        if (setting && setting.setting) {
            try {
                setting = JSON.parse(setting.setting)
                lang = setting.language
            }
            catch (err) {}
        }
        let result = this.generateHTTP(instance, lang)
        result = result.concat(this.generateMQTT(instance, lang))
        result = result.concat(this.generateCoAP(instance, lang))
        return result
    },
    generateHTTP (instance, lang) {
        return [{
            name: 'Attribute',
            protocolType: 'HTTP',
            configuration: {},
            description: 'Interface to update attributes via HTTP.',
            isInterface: true,
            documentation: fs.readFileSync(path.join(DocPath, `Attribute-HTTP-${lang}.md`)).toString()
        }, {
            name: 'Series',
            protocolType: 'HTTP',
            configuration: {},
            description: 'Interface to upload series data via HTTP.',
            isInterface: true,
            documentation: fs.readFileSync(path.join(DocPath, `Series-HTTP-${lang}.md`)).toString()
        }]
    },
    generateCoAP (instance, lang) {
        return [{
            name: 'Attribute',
            protocolType: 'CoAP',
            configuration: {},
            description: 'Interface to update attributes via CoAP.',
            isInterface: true,
            documentation: fs.readFileSync(path.join(DocPath, `Attribute-CoAP-${lang}.md`)).toString()
        }, {
            name: 'Series',
            protocolType: 'CoAP',
            configuration: {},
            description: 'Interface to upload series data via CoAP.',
            isInterface: true,
            documentation: fs.readFileSync(path.join(DocPath, `Series-CoAP-${lang}.md`)).toString()
        }]
    },
    generateMQTT (instance, lang) {
        return [{
            name: 'Attribute',
            protocolType: 'MQTT',
            configuration: {
                get channel () {
                    return `instance/${instance.id}/data/attributes`
                }
            },
            description: 'Interface to update attributes via MQTT.',
            isInterface: true,
            documentation: fs.readFileSync(path.join(DocPath, `Attribute-MQTT-${lang}.md`)).toString()
        }, {
            name: 'Series',
            protocolType: 'MQTT',
            configuration: {
                get channel () {
                    return `instance/${instance.id}/data/series`
                }
            },
            description: 'Interface to upload series data via MQTT.',
            isInterface: true,
            documentation: fs.readFileSync(path.join(DocPath, `Series-MQTT-${lang}.md`)).toString()
        }]
    }
}