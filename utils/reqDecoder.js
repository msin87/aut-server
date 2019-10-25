const Colors = require('../templates/colors');
const dictionary = 'CjYm8ZBqaAz2wQsSx3WFc4GrfvH5EtgbJMR6yhKnT7uLiUkV,X9oPNl.0p!-[=]~'.split('');
const revDictionary = new Map();
dictionary.forEach((val, index) => {
    revDictionary.set(val, index);
});
const deMixBits = b => {
    return (b & 0x80) + ((b & 0x40) >> 6) + ((b & 0x20) >> 4) + ((b & 0x10) >> 2) + (b & 0x08) + ((b & 0x04) << 2) + ((b & 0x02) << 4) + ((b & 0x01) << 6);
};
const ReqDecoder = input => {
    let output = '';
    for (let i = 0; i < input.length; i += 4) {
        let A0 = revDictionary.get(input[i]);
        let A1 = revDictionary.get(input[i + 1]);
        let A2 = revDictionary.get(input[i + 2]);
        let A3 = revDictionary.get(input[i + 3]);

        let s0 = deMixBits(A0 << 2 | ((A1 >> 4) & 3));
        let s1 = deMixBits((A1 & 0x0F) << 4 | ((A2 >> 2) & 0x0F));
        let s2 = deMixBits(((A2 & 0x03) << 6) | (A3 & 0x3F));
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
    return output;
};
const decoderMiddleWare = (req, res, next) => {
    const decoded = ReqDecoder(req.body['rqbody']);
    req.url = req.url + '?' + decoded;
    req.query = null;
    console.log(`${Colors.FgGreen}%s${Colors.reset}`,`[MaxiAP request]\r\n${Date()}\r\nIP: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress.split(':')[3]}\r\n${decoded}\r\n[End]`);
    next();
};
module.exports = decoderMiddleWare;