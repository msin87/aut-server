module.exports = str => {
    if (typeof (str) === 'boolean') return str;
    if (str===undefined) return false;
    switch (str.toLowerCase()) {
        case "false":
        case "no":
        case "0":
        case "":
            return false;
        default:
            return true;
    }
};