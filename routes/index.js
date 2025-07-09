const router = require('koa-router')()
const SystemRouter = require('./system')
const PIDRouter = require('./pid')
const AlertLevelRouter = require('./alert_level')
const HierarchyRouter = require('./hierarchy')
const HierarchySeriesRouter = require('./series')
const UserRouter = require('./user')
const RoleRouter = require('./roles')
const ModelGroupRouter = require('./model_group')
const ModelRouter = require('./model')
const ModelInstanceRouter = require('./instance')
const UnitRouter = require('./unit')
const LabelRouter = require('./label')
const TablesRouter = require('./tables')
const DashboardRouter = require('./dashboard')
const DashboardGroupRouter = require('./dashboard_group')
const MediaRouter = require('./media')
const RuleChainRouter = require('./rule_chains')
const TaskRouter = require('./tasks')
const PowerAdviceRouter = require('./power')
const FactorRouter = require('./factors')
const EnergyPriceRouter = require('./price')
const AssetTypeRouter = require('./asset_types')
const CarbonAssetRouter = require('./carbon_assets')
const ScheduleRouter = require('./schedules')
const DataRouter = require('./data')
const StatRouter = require('./stat')
const AlertRouter = require('./alerts')
const AlertTemplateRouter = require('./alert_templates')
const authentication = require('../middlewares/authentication')

router.use('/system', SystemRouter.routes(), SystemRouter.allowedMethods())

router.use('/unit', UnitRouter.routes(), UnitRouter.allowedMethods())

router.use('/label', LabelRouter.routes(), LabelRouter.allowedMethods())

router.use('/user', UserRouter.routes(), UserRouter.allowedMethods())

router.use('/instance', ModelInstanceRouter.routes(), ModelInstanceRouter.allowedMethods())

router.use(authentication.is_user)

router.use('/alert_level', AlertLevelRouter.routes(), AlertLevelRouter.allowedMethods())

router.use('/alert_template', AlertTemplateRouter.routes(), AlertTemplateRouter.allowedMethods())

router.use('/alert', AlertRouter.routes(), AlertRouter.allowedMethods())

router.use('/stat', StatRouter.routes(), StatRouter.allowedMethods())

router.use('/factors', FactorRouter.routes(), FactorRouter.allowedMethods())

router.use('/price', EnergyPriceRouter.routes(), EnergyPriceRouter.allowedMethods())

router.use('/tasks', TaskRouter.routes(), TaskRouter.allowedMethods())

router.use('/asset_types', AssetTypeRouter.routes(), AssetTypeRouter.allowedMethods())

router.use('/carbon_assets', CarbonAssetRouter.routes(), CarbonAssetRouter.allowedMethods())

router.use('/power', PowerAdviceRouter.routes(), PowerAdviceRouter.allowedMethods())

router.use('/schedules', ScheduleRouter.routes(), ScheduleRouter.allowedMethods())

router.use('/model', authentication.privileges('Data'), ModelRouter.routes(), ModelRouter.allowedMethods())

router.use('/model_group', authentication.privileges('Data'), ModelGroupRouter.routes(), ModelGroupRouter.allowedMethods())

router.use('/role', authentication.privileges('Privilege'), RoleRouter.routes(), RoleRouter.allowedMethods())

router.use('/hierarchy', HierarchyRouter.routes(), HierarchyRouter.allowedMethods())

router.use('/series', HierarchySeriesRouter.routes(), HierarchySeriesRouter.allowedMethods())

router.use('/pid', PIDRouter.routes(), PIDRouter.allowedMethods())

router.use('/rule_chains', RuleChainRouter.routes(), RuleChainRouter.allowedMethods())

router.use('/media', MediaRouter.routes(), MediaRouter.allowedMethods())

router.use('/tables', TablesRouter.routes(), TablesRouter.allowedMethods())

router.use('/dashboard', DashboardRouter.routes(), DashboardRouter.allowedMethods())

router.use('/dashboard_group', DashboardGroupRouter.routes(), DashboardGroupRouter.allowedMethods())

router.use('/data', DataRouter.routes(), DataRouter.allowedMethods())

router.get('/', async (ctx, next) => {
    ctx.body = {
        title: 'Hello World!'
    }
    return next()
})

module.exports = router
