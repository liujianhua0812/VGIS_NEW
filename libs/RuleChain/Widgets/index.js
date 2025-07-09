
let Input = require("./Input/Input")
let ReadAttributeValue = require("./Input/ReadAttributeValue")
let ReadSeriesLatestValue = require("./Input/ReadSeriesLatestValue")
let ReadSeriesHistoryValues = require("./Input/ReadSeriesHistoryValues")

let Transform = require("./Processing/Transform")

let Threshold = require("./Condition/Threshold")
let Switch = require("./Condition/Switch")
let Heartbeat = require("./Condition/Heartbeat")
let CustomCondition = require("./Condition/Custom")

let NotifyDevice = require("./Action/NotifyDevice")
let SendSMS = require("./Action/SendSMS")
let SendVoice = require("./Action/SendVoice")
let SendEmail = require("./Action/SendEmail")
let FireMalfunctionTask = require("./Action/FireMalfunctionTask")
let FirePowerSavingTask = require("./Action/FirePowerSavingTask")

let SaveSQL = require("./Storage/SaveSQL")
let SaveRedis = require("./Storage/SaveRedis")
let ReadRedis = require("./Storage/ReadRedis")

let Timer = require("./Other/Timer")

module.exports =  [{
    name: "Input",
    label: "dict.ruleChain.group.input",
    color: "#AAAAAA",
    widgets: [Input, ReadAttributeValue, ReadSeriesLatestValue, ReadSeriesHistoryValues]
}, {
    name: "Processing",
    label: "dict.ruleChain.group.processing",
    color: "#ff7300",
    widgets: [Transform]
}, {
    name: "Condition",
    label: "dict.ruleChain.group.condition",
    color: "#c0af00",
    widgets: [Threshold, Switch, Heartbeat, CustomCondition]
}, {
    name: "Action",
    label: "dict.ruleChain.group.action",
    color: "#ff4242",
    widgets: [NotifyDevice, SendEmail, SendSMS, SendVoice, FireMalfunctionTask, FirePowerSavingTask]
}, {
    name: "Storage",
    label: "dict.ruleChain.group.storage",
    color: "#1596ff",
    widgets: [SaveSQL, SaveRedis, ReadRedis]
}, {
    name: "Others",
    label: "dict.ruleChain.group.other",
    color: "#1cc00b",
    widgets: [Timer]
}]