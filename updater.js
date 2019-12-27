const axios = require('axios');
const PathUtil = require('path');
const qs = require('querystring');
const encoder = require('./utils/encryptDecrypt').encoder.cmd2504;
const fs = require('fs');
const request = require('request');
const http = require('http');
const Settings = require('./settings');
const urls = {logo: [], lgPackPath: [], softPackPath: []};
const resp = {android64: '', android32: ''};

const getData = req => new Promise((resolve, reject) => {
    axios.post(Settings.ip.store, qs.stringify(encoder('en', '0')), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => {
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
const checkExistFiles = path => new Promise((resolve, reject) => {

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
const pause_ms = ms => new Promise((resolve)=>{
  setTimeout(()=>resolve(),ms);
});
const getSize = url => new Promise((resolve, reject) => {
    this.retry = this.retry||0;
    request({
        url: url,
        method: "HEAD"
    }, (err, response, body) => {
        if (err){
            console.log(`error with ${url}: ${err} \r\n retry: ${retry}`);
            pause_ms(1000).then(getSize(url));
            reject(err);
            this.retry++;
        }
        else
        {
            resolve(+response.headers['content-length']);
        }

    });
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
    const allUrls = {size: 0, urls: [], paths: []};
    for (let res of queryArr) {
        console.log('n');
        for (let urlArr of res) {
            for (let url of urlArr) {
                const filePath = Settings.cars + url.replace(/http:\/\/[\w|\.]*/, '').replace(/\//g, '\\');
                console.log('Get file size for: '+url);
                allUrls.size += await getSize(url);
                // await makePath(filePath);
                // await downloadFile(filePath, url);
            }
        }
    }
    console.log(allUrls.size);
    return true;
};
getData().then(async res => {
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
};
