let xlsx = require('node-xlsx')
const path = require('path')
const fs = require('fs')

module.exports = function (db) {
    let Account = db.models.account
    let User = db.models.user
    let Resource = db.models.resources
    let Action = db.models.action

    return Promise.all([
        User.create({
            uid: 'Administrator'
        })
    ]).then(() => {
        return Promise.all([
            Account.create({
                accountName: 'Administrator',
                appPwd: "MJNVGISAdmin2021",
                uid: "Administrator",
                status: "activated",
                isInternal: true,
                isSuper: true
            }),
        ])
    }).then(() => {
        console.log("initialization finished");
    }).catch(err => {
        console.log(err.message);
    });
};
