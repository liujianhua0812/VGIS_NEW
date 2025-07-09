const LayoutPage = () => import("@/components/Admin/Layout/Layout.vue")
const HomePage = () => import("@/components/Admin/HomePage.vue")
const ProcessDiagramList = () => import("@/components/Admin/ProcessDiagramList.vue")
const ProcessDiagramDetail = () => import("@/components/Admin/ProcessDiagramDetail.vue")
const ProcessDiagramEditor = () => import("@/components/Admin/ProcessDiagramEditor.vue")
const PrivilegePage = () => import("@/components/Admin/PrivilegePage.vue")
const AccountPage = () => import("@/components/Admin/AccountPage.vue")
const ModelPageBackup = () => import("@/components/Admin/ModelPageBackup.vue")
const ModelPage = () => import("@/components/Admin/ModelPage.vue")
const ModelDetailPage = () => import("@/components/Admin/ModelDetailPage.vue")
const InstanceListPage = () => import("@/components/Admin/InstanceListPage.vue")
const InstanceDetailPage = () => import("@/components/Admin/InstanceDetailPage.vue")
const DataTablePage = () => import("@/components/Admin/DataTablePage.vue")
const MediaPage = () => import("@/components/Admin/MediaPage.vue")
const PidEditPage = () => import("@/components/Admin/ProcessDiagramEditor.vue")
const BIDashboard = () => import("@/components/Admin/BIDashboard.vue")
const BITemplates = () => import("@/components/Admin/BITemplates.vue")
const AlertListPage = () => import("@/components/Admin/AlertListPage.vue")
const SettingPage = () => import("@/components/Admin/SettingPage.vue")

export default {
    path: "/admin",
    component: LayoutPage,
    children: [
        {
            path: '',
            name: "AdminHome",
            component: HomePage,
            meta: {
                signInRequired: true
            }
        },{
            path: 'setting',
            name: "SettingPage",
            component: SettingPage,
            meta: {
                signInRequired: true
            }
        },
        // {
        //     path: 'data/media',
        //     name: "MediaPage",
        //     component: MediaPage,
        //     meta: {
        //         superOnly: false,
        //         auth: {resources: 'Data'}
        //     }
        // },
        {
            path: 'data/pid',
            name: "ProcessDiagramList",
            component: ProcessDiagramList,
            meta: {
                superOnly: false,
                auth: {resources: 'Process Diagram'}
            }
        },
        {
            path: 'data/pid/:diagramId',
            name: "ProcessDiagramDetail",
            component: ProcessDiagramDetail,
            meta: {
                superOnly: false,
                auth: {resources: 'Process Diagram'}
            }
        },
        {
            path: 'data/pid/:diagramId/edit',
            name: "ProcessDiagramEditor",
            component: ProcessDiagramEditor,
            meta: {
                superOnly: false,
                auth: {resources: 'Process Diagram', action: "admin"}
            }
        },
        {
            path: '/data/model/',
            name: "ModelListPage",
            component: ModelPage,
            meta: {
                superOnly: false,
                auth: {resources: 'Model'}
            },
            children: [
                {
                    path: ':modelId',
                    name: "ModelDetailPage",
                    component: ModelDetailPage,
                    meta: {
                        superOnly: false,
                        auth: {resources: 'Model'}
                    },
                },
                {
                    path: ':modelId/instance',
                    name: "InstanceListPage",
                    component: InstanceListPage,
                    meta: {
                        superOnly: false,
                        auth: {resources: 'Instance'}
                    },
                },
                {
                    path: ':modelId/instances/:instanceId',
                    name: "InstanceDetailPage",
                    component: InstanceDetailPage,
                    meta: {
                        superOnly: false,
                        auth: {resources: 'Instance'}
                    },
                },
            ]
        },
        {
            path: '/data/pid/:modelId/edit',
            name: "PidEdit",
            component: PidEditPage,
            meta: {
                superOnly: false,
                hideSideBar: true,
                auth: {resources: 'Model'}
            }
        },
        {
            path: '/data/table/',
            name: "DataTablePage",
            component: DataTablePage,
            meta: {
                superOnly: false,
                auth: {resources: 'Model'}
            }
        },
        {
            path: '/data/privilege',
            name: "privilege",
            component: PrivilegePage,
            meta: {
                superOnly: false,
                auth: {resources: 'Privilege'}
            }
        },
        {
            path: '/data/account',
            name: "accounts",
            component: AccountPage,
            meta: {
                superOnly: false,
                auth: {resources: 'Account'}
            }
        },
        {
            path: 'alert',
            name: "AlertListPage",
            component: AlertListPage,
            meta: {
                superOnly: false,
                auth: {resources: 'Alert'}
            }
        },
        {
            path: '/bieditor/dashboard',
            name: "BIDashboard",
            component: BIDashboard,
            meta: {
                superOnly: false,
                auth: {resources: 'BIDashboard'}
            }
        },
        {
            path: '/bieditor/template',
            name: "BITemplates",
            component: BITemplates,
            meta: {
                superOnly: false,
                auth: {resources: 'BITemplates'}
            }
        }
    ]
}
