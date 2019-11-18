const MD5 = require('md5');
const dictionary = 'CjYm8ZBqaAz2wQsSx3WFc4GrfvH5EtgbJMR6yhKnT7uLiUkV,X9oPNl.0p!-[=]~'.split('');
const simpleRandom = require('../utils/random');
const logger = require('../logger/logger');
const revDictionary = new Map();
dictionary.forEach((val, index) => {
    revDictionary.set(val, index);
});
const MixBits = b => {
    return (b & 0x80) + ((b & 0x40) >> 6) + ((b & 0x20) >> 4) + ((b & 0x10) >> 2) + (b & 0x08) + ((b & 0x04) << 2) + ((b & 0x02) << 4) + ((b & 0x01) << 6);
};
const EncryptDecrypt = input => {
    if (logger.settings.level === 'DEBUG') logger.DEBUG(`Decrypt request. Enter. Input: ${input}`);
    let output = '';
    for (let i = 0; i < input.length; i += 4) {
        let A0 = revDictionary.get(input[i]);
        let A1 = revDictionary.get(input[i + 1]);
        let A2 = revDictionary.get(input[i + 2]);
        let A3 = revDictionary.get(input[i + 3]);

        let s0 = MixBits(A0 << 2 | ((A1 >> 4) & 3));
        let s1 = MixBits((A1 & 0x0F) << 4 | ((A2 >> 2) & 0x0F));
        let s2 = MixBits(((A2 & 0x03) << 6) | (A3 & 0x3F));
        output = output + String.fromCharCode(s0) + String.fromCharCode(s1) + String.fromCharCode(s2);
    }
    switch ((revDictionary.get(input[1]) >> 4) & 3) {
        case 0:
            output = output.slice(1).replace(/\0/g, '');
            break;
        case 1:
            output = output.slice(1).replace(/\0/g, '').slice(0, -2);
            break;
        case 2:
            output = output.slice(1).replace(/\0/g, '').slice(0, -1);
            break;
    }
    if (logger.settings.level === 'DEBUG') logger.DEBUG(`Decrypt request. Complete. Output: ${output}`);
    return output;
};
const Random = () => {
    const random = simpleRandom(127, 255);
    return random === 0 ? 170 : random;
};
const ReqEncoder = bArr => {
    let output = [];
    const i = bArr.length;
    const bArr2 = [i + 3 + 1]
    for (let i2 = 0; i2 < i; i2++) {
        bArr2[i2 + 1] = MixBits(bArr[i2].charCodeAt(0));
    }
    bArr2[0] = (Random() & 0xFC);
    let i3 = i + 1;
    if (i3 % 3 === 1) {
        bArr2[0] = (bArr2[0] | 1);
        bArr2[i3] = simpleRandom(127, 255);
        bArr2[i3 + 1] = simpleRandom(127, 255);
    } else if (i3 % 3 === 2) {
        bArr2[0] = (bArr2[0] | 2);
        bArr2[i3] = simpleRandom(127, 255);
    }
    const n = bArr2.length;

    for (let n3 = 0, n2 = 0; n3 + 2 < n; n3 += 3, n2 += 4) {
        const n4 = bArr2[n3] & 0xFF;
        const n5 = bArr2[n3 + 1] & 0xFF;
        const n6 = bArr2[n3 + 2] & 0xFF;
        output[n2] = dictionary[(n4 >> 2) % 64]; //теряем два младших бита у n4
        output[n2 + 1] = dictionary[((n4 & 0x3) << 4 | n5 >> 4) % 64]; //два младших бита n4 будут теперь 5 и 4 битами
        output[n2 + 2] = dictionary[((n5 & 0xF) << 2 | n6 >> 6) % 64];
        output[n2 + 3] = dictionary[(n6 & 0x3F) % 64];
    }
    output = output.join('');
    return output;
};
const decoderMiddleWare = (req, res, next) => {
    if (req.body['rqbody']) {
        if (logger.settings.level === 'DEBUG') logger.DEBUG(`decoderMiddleWare. Enter. Request: ${req.body['rqbody']}`);
        const decoded = EncryptDecrypt(req.body['rqbody']);
        if (logger.settings.level === 'DEBUG') logger.DEBUG(`decoderMiddleWare. rqbody is decoded. Request: ${req.body['rqbody']}`);
        req.url = req.url + '?' + decoded;
        req.query = null;
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress.split(':')[3];
        if (ip==='127.0.0.1') ip='Telegram'
        logger.COMMAND(`IP: ${ip} ${decoded}`);
        next();
    } else {
        if (logger.settings.level === 'DEBUG') logger.DEBUG(`decoderMiddleWare. Enter. Request req.body['rqbody'] is empty`);
        res.sendStatus(403);
    }
};
module.exports = {
    decoder: decoderMiddleWare,
    encoder: {
        cmd2504: (lag, sys, sn) => {
            let string;
            if (sn) {
                const ck = MD5(`2504${lag}0${sys}AutelMall`);
                string = `lag=${lag}&ck=${ck}&sys=${sys}&cmd=2504&area=acf_North_America`;
            } else {
                const ck = MD5(`acf_North_America2504${lag}${sys}AutelMall`);
                string = `lag=${lag}&ck=${ck}&sys=${sys}&cmd=2504&area=acf_North_America`;
            }
            return {rqbody: ReqEncoder(string)};
        }
    }
};
