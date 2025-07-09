
import Input from "@/components/Admin/RuleChain/Widgets/Input/Input";
import ReadAttributeValue from "@/components/Admin/RuleChain/Widgets/Input/ReadAttributeValue";
import ReadSeriesLatestValue from "@/components/Admin/RuleChain/Widgets/Input/ReadSeriesLatestValue";
import ReadSeriesHistoryValues from "@/components/Admin/RuleChain/Widgets/Input/ReadSeriesHistoryValues";

import Transform from "@/components/Admin/RuleChain/Widgets/Processing/Transform";

import Threshold from "@/components/Admin/RuleChain/Widgets/Condition/Threshold";
import Switch from "@/components/Admin/RuleChain/Widgets/Condition/Switch";
import Heartbeat from "@/components/Admin/RuleChain/Widgets/Condition/Heartbeat";
import CustomCondition from "@/components/Admin/RuleChain/Widgets/Condition/Custom"

import NotifyDevice from "@/components/Admin/RuleChain/Widgets/Action/NotifyDevice";
import SendSMS from "@/components/Admin/RuleChain/Widgets/Action/SendSMS";
import SendVoice from "@/components/Admin/RuleChain/Widgets/Action/SendVoice";
import SendEmail from "@/components/Admin/RuleChain/Widgets/Action/SendEmail";
import FireMalfunctionTask from "@/components/Admin/RuleChain/Widgets/Action/FireMalfunctionTask";
import FirePowerSavingTask from "@/components/Admin/RuleChain/Widgets/Action/FirePowerSavingTask";
import SendBACNet from "@/components/Admin/RuleChain/Widgets/Action/SendBACNet";
import SendHTTP from "@/components/Admin/RuleChain/Widgets/Action/SendHTTP";

import SaveSQL from "@/components/Admin/RuleChain/Widgets/Storage/SaveSQL";
import SaveRedis from "@/components/Admin/RuleChain/Widgets/Storage/SaveRedis";
import ReadRedis from "@/components/Admin/RuleChain/Widgets/Storage/ReadRedis";

import Timer from "@/components/Admin/RuleChain/Widgets/Other/Timer";

export default [{
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
    widgets: [NotifyDevice, SendEmail, SendSMS, SendVoice, FireMalfunctionTask, FirePowerSavingTask, SendHTTP, SendBACNet]
}, {
    name: "Storage",
    label: "dict.ruleChain.group.storage",
    color: "#1596ff",
    widgets: [SaveSQL, SaveRedis, ReadRedis]
}/*, {
    name: "Others",
    label: "dict.ruleChain.group.other",
    color: "#1cc00b",
    widgets: [Timer]
}*/]