const axios = require('axios')
const {rsaPublicEncrypt} = require('../libs/SecurityUtil');

let instanceId = '1c2d47c9-3396-4af1-ac1d-594e5e4702d6'
let host = 'http://192.168.1.33:3005'
let path = '/instance/' + instanceId + '/data/series'

const publicKey = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkrXLtgTinmDWC/McKKdW\nnKPpP/5cHzhsEvQHVPMn7UGvChh2LJ6Prrm6ZOltH8UPLwrOclSGBmRgYPTB9Zfo\nInrec5JxyuZUgo8lVsne3xauMGGI5s7+vBvqPp9dUDfR9OCq1x5fp0v8YWFCf5wg\n68BFI9PAirgOGDhR9QAhzs3u2M5oKOG4SCeALu1kCejndLEeaHvEd4SBu3nWZ9Ha\nv8tJXs243TdM7wwnVJRglvpM8q7Bl05wpG9MUJAWU4h/64j6gcDo9mNp0Xc4Al82\noweunidyOxyhIc7dBwXzuVJMHhVlooONkUBPpqEYSWBBIM3cbsv2TYk7GUH7F3yz\n+QIDAQAB\n-----END PUBLIC KEY-----\n"
const encrypted = rsaPublicEncrypt(publicKey, instanceId);

const json = JSON.stringify({
    "data": [
        {
            "name": "Closed Sour Wells",
            "value": "15"
        },
        {
            "name": "Closed Sweet Wells",
            "value": "25"
        }
    ],
    "token": encrypted
});

axios.post(host + path, json,{
    headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
    }
}).then((response) =>
        console.log(response.data));