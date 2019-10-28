const axios = require('axios');
const qs = require('querystring');
const encoder = require('../utils/encryptDecrypt').encoder.cmd2504;
const Settings = require('../settings');

const getData = req => new Promise((resolve, reject) => {

    axios.post(Settings.ip.store, qs.stringify(encoder('en', '0')), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => {
        console.log(res);
        for (let minSaleUnit of res.data.data.result.minSaleUnit) {
            for (let soft of minSaleUnit.soft) {
                logo.push(soft.logo.split('|').replace(/http:\/\/[\w|\.]*/, ''));
                lgPackPath.push(soft.lgPackPath.split('|').map(val => val.replace(/http:\/\/[\w|\.]*/, '')))
                softPackPath.push(soft.softPackPath.split('|'))
            }
        }
    }).catch(e => {
        console.log(e);
    });
})


const Updater = () => {
    const start = time => {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {

        }, time)
    }
}
