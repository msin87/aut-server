module.exports = (result, errcode, success) => ({
    data: result?{result}:null,
    errcode: errcode,
    success: success,
});