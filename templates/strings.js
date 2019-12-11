module.exports = {
    Errors: {
        noError: 'S0000',
        dataError: 'S0001',
        emailDoesNotExist: 'S0002',
        wrongPassword: 'S0003',
        accountHasExist: 'S0004',
        wrongConfirmCode: 'S0005',
        serialHasBinded: 'S0006',
        serialProductPassword: 'S0007',
        serialDoesNotExist: 'S0008',
        languageError: 'S0009',
        orderIsNotExist: 'S0010',
        currencyError: 'S0011',
        productError: 'S0012',
        communicationFailed: 'S0013'
    },
    Success: {
        success: '1',
        notSuccess: '0'
    },
    AppPlatform: {
        android64: 64,
        android32: 32,
        iOS: 0
    },
    UserState: {
        ok: 'ok',
        notAllowed: 'notAllowed',
        expired: 'expired',
        notExist: 'notExist',
        wrongPassword: 'wrongPassword',
        banned: 'banned',
    },
    Messages:{
        missingSerial: 'Missing serial number in request',
        sendingCars: 'Sending %bit bit cars to user %email, firstName: %firstName'
    }
};