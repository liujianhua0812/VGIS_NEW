let { Sequelize } = require('sequelize')
let path = require('path')

module.exports = async function (database, username, password, config) {
    let sequelize = new Sequelize(database, username, password, config)
    // 用这种方式把数据表引入到sequelize里
    let System = require("./models/System")(sequelize, Sequelize.DataTypes)

    let FlyRoute = require("./models/FlyRoute")(sequelize, Sequelize.DataTypes)
    let PID = require("./models/PID")(sequelize, Sequelize.DataTypes)
    let PIDAnchorPoint = require("./models/PIDAnchorPoint")(sequelize, Sequelize.DataTypes)
    let Job = require("./models/Job")(sequelize, Sequelize.DataTypes)
    let Org = require("./models/Org")(sequelize, Sequelize.DataTypes)
    let Account = require("./models/Account")(sequelize, Sequelize.DataTypes)
    let User = require("./models/User")(sequelize, Sequelize.DataTypes)
    let UserJob = require("./models/UserJob")(sequelize, Sequelize.DataTypes)
    let Role = require("./models/Role")(sequelize, Sequelize.DataTypes)
    let Resources = require("./models/Resources")(sequelize, Sequelize.DataTypes)
    let Action = require("./models/Action")(sequelize, Sequelize.DataTypes)
    let Privilege = require("./models/Privilege")(sequelize, Sequelize.DataTypes)

    let Unit = require("./models/Unit")(sequelize, Sequelize.DataTypes)
    let Label = require("./models/Label")(sequelize, Sequelize.DataTypes)
    let Has = require("./models/Has")(sequelize, Sequelize.DataTypes)
    let Model = require("./models/Model")(sequelize, Sequelize.DataTypes)
    let ModelGroup = require("./models/ModelGroup")(sequelize, Sequelize.DataTypes)
    let StaticAttribute = require("./models/StaticAttribute")(sequelize, Sequelize.DataTypes)
    let TimeSeries = require("./models/TimeSeries")(sequelize, Sequelize.DataTypes)
    let ModelRelation = require("./models/ModelRelation")(sequelize, Sequelize.DataTypes)
    let ModelInstance = require("./models/ModelInstance")(sequelize, Sequelize.DataTypes)
    let InstanceRelation = require("./models/InstanceRelation")(sequelize, Sequelize.DataTypes)
    let InstanceTimeSeries = require("./models/InstanceTimeSeries")(sequelize, Sequelize.DataTypes)
    let AttributeValue = require("./models/AttributeValue")(sequelize, Sequelize.DataTypes)
    let SeriesValue = require("./models/SeriesValue")(sequelize, Sequelize.DataTypes)
    let Protocol = require("./models/Protocol")(sequelize, Sequelize.DataTypes)

    let Alert = require("./models/Alert")(sequelize, Sequelize.DataTypes)
    let AlertTemplate = require("./models/AlertTemplate")(sequelize, Sequelize.DataTypes)

    let DataTable = require("./models/DataTable")(sequelize, Sequelize.DataTypes)
    let TableField = require("./models/TableField")(sequelize, Sequelize.DataTypes)
    let TableRelation = require("./models/TableRelation")(sequelize, Sequelize.DataTypes)

    let MediaFile = require("./models/MediaFile")(sequelize, Sequelize.DataTypes)

    let RuleChain = require('./models/RuleChain')(sequelize, Sequelize.DataTypes)

    let Dashboard = require("./models/Dashboard")(sequelize, Sequelize.DataTypes)
    let DashboardTemplate = require("./models/DashboardTemplate")(sequelize, Sequelize.DataTypes)
    let DashboardGroup = require("./models/DashboardGroup")(sequelize, Sequelize.DataTypes)

    // Third Party
    let DailyReport = require("./models/DailyReport")(sequelize, Sequelize.DataTypes)
    let MonthlyReport = require("./models/MonthlyReport")(sequelize, Sequelize.DataTypes)
    let EnvironmentReport = require("./models/EnvironmentReport")(sequelize, Sequelize.DataTypes)
    let URSReport = require("./models/URSReport")(sequelize, Sequelize.DataTypes)

    let AutomationSchedule = require("./models/AutomationSchedule")(sequelize, Sequelize.DataTypes)
    let MaintenanceSchedule = require("./models/MaintenanceSchedule")(sequelize, Sequelize.DataTypes)
    let MaintenanceTask = require("./models/MaintenanceTask")(sequelize, Sequelize.DataTypes)
    let PowerSavingTask = require("./models/PowerSavingTask")(sequelize, Sequelize.DataTypes)
    let MalfunctionTask = require("./models/MalfunctionTask")(sequelize, Sequelize.DataTypes)
    let AlertLevel = require("./models/AlertLevel")(sequelize, Sequelize.DataTypes)
    let PersonRelation = require("./models/PersonRelation")(sequelize, Sequelize.DataTypes)
    let DeviceRelation = require("./models/DeviceRelation")(sequelize, Sequelize.DataTypes)

    let ConversionFactor = require("./models/ConversionFactor")(sequelize, Sequelize.DataTypes)
    let FactorValue = require("./models/FactorValue")(sequelize, Sequelize.DataTypes)
    let AssetType = require("./models/AssetType")(sequelize, Sequelize.DataTypes)
    let CarbonAsset = require("./models/CarbonAsset")(sequelize, Sequelize.DataTypes)
    let GeneralEnergyPrice = require("./models/GeneralEnergyPrice")(sequelize, Sequelize.DataTypes)
    let ElectricityPrice = require("./models/ElectricityPrice")(sequelize, Sequelize.DataTypes)

    PID.hasMany(PIDAnchorPoint, { foreignKey: 'diagramId' })
    PIDAnchorPoint.belongsTo(PID, { foreignKey: 'diagramId' })

    PID.belongsTo(ModelInstance, { foreignKey: 'nodeId', onUpdate: "SET NULL", onDelete: "SET NULL" })
    ModelInstance.hasMany(PID, { foreignKey: 'nodeId', onUpdate: "SET NULL", onDelete: "SET NULL" })

    AssetType.hasMany(CarbonAsset, { foreignKey: 'typeId' })
    CarbonAsset.belongsTo(AssetType, { foreignKey: 'typeId' })

    User.hasMany(CarbonAsset, { foreignKey: 'recorderId' })
    CarbonAsset.belongsTo(User, { foreignKey: 'recorderId' })

    CarbonAsset.hasMany(MediaFile, { foreignKey: 'assetId' })
    MediaFile.belongsTo(CarbonAsset, { foreignKey: 'assetId' })

    ConversionFactor.hasMany(FactorValue, { foreignKey: 'factorId' })
    FactorValue.belongsTo(ConversionFactor, { foreignKey: 'factorId' })

    Unit.hasMany(ConversionFactor, { foreignKey: 'unitId' })
    ConversionFactor.belongsTo(Unit, { foreignKey: 'unitId' })

    AutomationSchedule.hasMany(PersonRelation, { foreignKey: 'aScheduleId' })
    PersonRelation.belongsTo(AutomationSchedule, { foreignKey: 'aScheduleId' })

    RuleChain.hasMany(AutomationSchedule, { foreignKey: 'chainId' })
    AutomationSchedule.belongsTo(RuleChain, { foreignKey: 'chainId' })

    MaintenanceSchedule.hasMany(PersonRelation, { foreignKey: 'mScheduleId' })
    MaintenanceTask.hasMany(PersonRelation, { foreignKey: 'mTaskId' })
    PowerSavingTask.hasMany(PersonRelation, { foreignKey: 'psTaskId' })
    MalfunctionTask.hasMany(PersonRelation, { foreignKey: 'mfTaskId' })
    AlertTemplate.hasMany(PersonRelation, { foreignKey: 'templateId' })

    PersonRelation.belongsTo(MaintenanceSchedule, { foreignKey: 'mScheduleId' })
    PersonRelation.belongsTo(MaintenanceTask, { foreignKey: 'mTaskId' })
    PersonRelation.belongsTo(PowerSavingTask, { foreignKey: 'psTaskId' })
    PersonRelation.belongsTo(MalfunctionTask, { foreignKey: 'mfTaskId' })
    PersonRelation.belongsTo(AlertTemplate, { foreignKey: 'templateId' })

    User.hasMany(PersonRelation, { foreignKey: 'userId' })
    PersonRelation.belongsTo(User, { foreignKey: 'userId' })

    AutomationSchedule.hasMany(DeviceRelation, { foreignKey: 'aScheduleId' })
    DeviceRelation.belongsTo(AutomationSchedule, { foreignKey: 'aScheduleId' })

    MaintenanceSchedule.hasMany(DeviceRelation, { foreignKey: 'mScheduleId' })
    MaintenanceTask.hasMany(DeviceRelation, { foreignKey: 'mTaskId' })
    PowerSavingTask.hasMany(DeviceRelation, { foreignKey: 'psTaskId' })
    MalfunctionTask.hasMany(DeviceRelation, { foreignKey: 'mfTaskId' })
    AlertTemplate.hasMany(DeviceRelation, { foreignKey: 'templateId' })

    DeviceRelation.belongsTo(MaintenanceSchedule, { foreignKey: 'mScheduleId' })
    DeviceRelation.belongsTo(MaintenanceTask, { foreignKey: 'mTaskId' })
    DeviceRelation.belongsTo(PowerSavingTask, { foreignKey: 'psTaskId' })
    DeviceRelation.belongsTo(MalfunctionTask, { foreignKey: 'mfTaskId' })
    DeviceRelation.belongsTo(AlertTemplate, { foreignKey: 'templateId' })

    MalfunctionTask.belongsTo(AlertLevel, { foreignKey: 'levelId' })
    AlertLevel.hasMany(MalfunctionTask, { foreignKey: 'levelId' })

    ModelInstance.hasMany(DeviceRelation, { foreignKey: 'instanceId' })
    DeviceRelation.belongsTo(ModelInstance, { foreignKey: 'instanceId' })

    ModelInstance.hasMany(MediaFile, { foreignKey: 'instanceId' })
    MediaFile.belongsTo(ModelInstance, { foreignKey: 'instanceId' })

    Model.hasMany(MediaFile, { foreignKey: 'modelId' })
    MediaFile.belongsTo(Model, { foreignKey: 'modelId' })

    User.hasMany(MediaFile, { foreignKey: 'uploaderid', as: 'uploader' })
    MediaFile.belongsTo(User, { foreignKey: 'uploaderid', as: 'uploader' })

	Dashboard.belongsTo(MediaFile, { foreignKey: 'thumbnail' })
    DashboardTemplate.belongsTo(MediaFile, { foreignKey: 'thumbnail' })

    DashboardGroup.hasMany(Dashboard, { foreignKey: 'groupId' })
    Dashboard.belongsTo(DashboardGroup, { foreignKey: 'groupId' })

    DashboardTemplate.hasMany(Dashboard, { foreignKey: 'groupId' })
    Dashboard.belongsTo(DashboardTemplate, { foreignKey: 'groupId' })

    DashboardGroup.hasMany(DashboardGroup, { as: 'Children', foreignKey: 'groupId' })
    DashboardGroup.belongsTo(DashboardGroup, { as: 'Parent', foreignKey: 'groupId' })

    ModelGroup.hasMany(Model, { foreignKey: 'groupId' })
    Model.belongsTo(ModelGroup, { foreignKey: 'groupId' })

    ModelGroup.hasMany(ModelGroup, { as: 'Children', foreignKey: 'groupId' })
    ModelGroup.belongsTo(ModelGroup, { as: 'Parent', foreignKey: 'groupId' })

    Model.belongsToMany(Model, { as: 'Targets', through: ModelRelation, foreignKey: 'sourceId' })
    Model.belongsToMany(Model, { as: 'Sources', through: ModelRelation, foreignKey: 'targetId' })

    Model.hasMany(StaticAttribute, { foreignKey: 'modelId', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    StaticAttribute.belongsTo(Model, { foreignKey: 'modelId', onDelete: 'CASCADE', onUpdate: 'CASCADE' })

    Model.hasMany(TimeSeries, { foreignKey: 'modelId', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    TimeSeries.belongsTo(Model, { foreignKey: 'modelId', onDelete: 'CASCADE', onUpdate: 'CASCADE' })

    Unit.hasMany(TimeSeries, { foreignKey: 'unitId', onDelete: 'SET NULL', onUpdate: 'SET NULL' })
    TimeSeries.belongsTo(Unit, { foreignKey: 'unitId', onDelete: 'SET NULL', onUpdate: 'SET NULL' })

    Unit.hasMany(StaticAttribute, { foreignKey: 'unitId', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    StaticAttribute.belongsTo(Unit, { foreignKey: 'unitId', onDelete: 'CASCADE', onUpdate: 'CASCADE' })

    StaticAttribute.belongsToMany(Label, { foreignKey: 'attributeId', through: Has, uniqueKey: 'id' })
    TimeSeries.belongsToMany(Label, { foreignKey: 'seriesId', through: Has, uniqueKey: 'id' })
    Model.belongsToMany(Label, { foreignKey: 'modelId', through: Has, uniqueKey: 'id' })
    ModelInstance.belongsToMany(Label, { foreignKey: 'instanceId', through: Has, uniqueKey: 'id' })
    Label.hasMany(Has, { foreignKey: 'labelId' })

    Model.hasMany(ModelInstance, { foreignKey: 'modelId' })
    ModelInstance.belongsTo(Model, { foreignKey: 'modelId' })

    Model.hasMany(Model, { as: 'Children', foreignKey: 'parentId' })
    Model.belongsTo(Model, { as: 'Parent', foreignKey: 'parentId' })

    Model.hasMany(AlertTemplate, { foreignKey: 'modelId', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    AlertTemplate.belongsTo(Model, { foreignKey: 'modelId', onDelete: 'CASCADE', onUpdate: 'CASCADE' })

    StaticAttribute.hasMany(AttributeValue, { foreignKey: 'attributeId' })
    AttributeValue.belongsTo(StaticAttribute, { foreignKey: 'attributeId' })

    ModelInstance.hasMany(AttributeValue, { foreignKey: 'instanceId' })
    AttributeValue.belongsTo(ModelInstance, { foreignKey: 'instanceId' })

    // //added by chen shenghong
    ModelInstance.hasMany(SeriesValue, { foreignKey: 'instanceId' })
    SeriesValue.belongsTo(ModelInstance, { foreignKey: 'instanceId' })
    TimeSeries.hasMany(SeriesValue, { foreignKey: 'seriesId' })
    SeriesValue.belongsTo(TimeSeries, { foreignKey: 'seriesId' })

    ModelInstance.hasMany(InstanceTimeSeries, { foreignKey: 'instanceId' })
    InstanceTimeSeries.belongsTo(ModelInstance, { foreignKey: 'instanceId' })
    TimeSeries.hasMany(InstanceTimeSeries, { foreignKey: 'seriesId' })
    InstanceTimeSeries.belongsTo(TimeSeries, { foreignKey: 'seriesId' })

    ModelInstance.hasMany(PID, { foreignKey: 'nodeId', onUpdate: "CASCADE", onDelete: "CASCADE" })
    PID.belongsTo(ModelInstance, { foreignKey: 'nodeId', onUpdate: "CASCADE", onDelete: "CASCADE" })

    ModelInstance.hasMany(Alert, { foreignKey: 'instanceId', onUpdate: "CASCADE", onDelete: "CASCADE" })
    Alert.belongsTo(ModelInstance, { foreignKey: 'instanceId', onUpdate: "CASCADE", onDelete: "CASCADE" })

    ModelInstance.hasMany(Protocol, { foreignKey: 'instanceId' })
    Protocol.belongsTo(ModelInstance, { foreignKey: 'instanceId' })

    ModelInstance.belongsToMany(ModelInstance, { as: 'Children', through: InstanceRelation, foreignKey: 'parentId', uniqueKey: 'id' })
    ModelInstance.belongsToMany(ModelInstance, { as: 'Parents', through: InstanceRelation, foreignKey: 'childId', uniqueKey: 'id' })

    // Table
    DataTable.hasMany(TableField, { foreignKey: 'tableId' })
    TableField.belongsTo(DataTable, { foreignKey: 'tableId' })

    Unit.hasMany(TableField, { foreignKey: 'unitId' })
    TableField.belongsTo(Unit, { foreignKey: 'unitId' })

    DataTable.belongsToMany(Model, { through: TableRelation, foreignKey: 'tableId' })
    Model.belongsToMany(DataTable, { through: TableRelation, foreignKey: 'modelId' })

    DataTable.hasMany(TableRelation, { foreignKey: 'tableId' })
    TableRelation.belongsTo(DataTable, { foreignKey: 'tableId' })
    Model.hasMany(TableRelation, { foreignKey: 'modelId' })
    TableRelation.belongsTo(Model, { foreignKey: 'modelId' })
    TableField.hasMany(TableRelation, { foreignKey: 'fieldId' })
    TableRelation.belongsTo(TableField, { foreignKey: 'fieldId' })

    // Legacy configurations

    User.hasMany(Account, { foreignKey: 'uid' })
    Account.belongsTo(User, { foreignKey: 'uid' })

    User.hasMany(UserJob, { foreignKey: 'uid' })
    UserJob.belongsTo(User, { foreignKey: 'uid' })

    Org.hasMany(UserJob, { foreignKey: 'orgId' })
    UserJob.belongsTo(Org, { foreignKey: 'orgId' })

    Job.hasMany(UserJob, { foreignKey: 'jobId' })
    UserJob.belongsTo(Job, { foreignKey: 'jobId' })

    Account.belongsTo(Role, { foreignKey: 'roleId', onDelete: "SET NULL" })
    Role.hasMany(Account, { foreignKey: 'roleId', onDelete: "SET NULL" })

    Role.hasMany(Privilege, { foreignKey: 'roleId' })
    Privilege.belongsTo(Role, { foreignKey: 'roleId' })
    Action.hasMany(Privilege, { foreignKey: 'actionId' })
    Privilege.belongsTo(Action, { foreignKey: 'actionId' })
    Resources.hasMany(Privilege, { foreignKey: 'resourceId' })
    Privilege.belongsTo(Resources, { foreignKey: 'resourceId' })
    Resources.hasMany(Resources, { as: 'Children', foreignKey: 'resourceId' })
    Resources.belongsTo(Resources, { as: 'Parent', foreignKey: 'resourceId' })

    if (!config.first) {
        await require('./models/metas').define(sequelize, Sequelize.DataTypes)
        await require('./models/series_value_metas').define(sequelize, Sequelize.DataTypes)
    }
    return sequelize
};
