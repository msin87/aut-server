const axios = require('axios');
const PathUtil = require('path');
const qs = require('querystring');
const encoder = require('./utils/encryptDecrypt').encoder.cmd2504;
const fs = require('fs');
const http = require('http');
const Settings = require('./settings');
const urls = {logo: [], lgPackPath: [], softPackPath: []};
const resp = {android64: '', android32: ''};

const getData = req => new Promise((resolve, reject) => {
    axios.post(Settings.ip.store, qs.stringify(encoder('en', '0')), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => {
        console.log(res);
        for (let minSaleUnit of res.data.data.result.minSaleUnit) {
            for (let soft of minSaleUnit.soft) {
                urls.logo.push(soft.logo.split('|'));
                urls.lgPackPath.push(soft.lgPackPath.split('|'));
                urls.softPackPath.push(soft.softPackPath.split('|'))
            }
        }
        resolve({...res.data.data.result, urls});
    })
});
const makePath = path => new Promise((resolve, reject) => {
    if (!fs.existsSync(PathUtil.dirname(path))) {
        fs.mkdir(PathUtil.dirname(path), {recursive: true}, err => {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    } else {
        resolve(false);
    }
});
const downloadFile = (path, url) => new Promise((resolve, reject) => {
        if (!fs.existsSync(path)) {
            const file = fs.createWriteStream(path);
            const req = http.get(url, function (response) {
                response.pipe(file);
                resolve(true);
            });
        } else {
            resolve(false);
        }
    }
);
const downloadAll = async queryArr => {
    for (let res of queryArr) {
        console.log('n');
        for (let urlArr of res) {
            for (let url of urlArr) {
                const filePath = Settings.cars + url.replace(/http:\/\/[\w|\.]*/, '').replace(/\//g, '\\');
                await makePath(filePath);
                await downloadFile(filePath, url);
            }
        }
    }
    return true;
};
getData().then(async res => {
//.map(val => val.replace(/http:\/\/[\w|\.]*/
        console.log(res);
        await downloadAll([res.urls.logo, res.urls.lgPackPath, res.urls.softPackPath]);
        return true;
    }
).catch(console.log);

const Updater = () => {
    const start = time => {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {

        }, time)
    }
}
