const child_process = require('child_process');
const codePage = require('legacy-encoding');
const assert = require('assert');
const asyncExec = (cmd, encoding) => new Promise((resolve, reject) => {
    child_process.exec(cmd, {shell: true, encoding: 'byte'}, (error, stdout, stderr) => {
        if (error) {
            reject(error);
            return;
        }
        if (stderr.byteLength) {
            reject(stderr);
            return;
        }
        resolve(codePage.decode(stdout.toString('binary'), encoding));
    });
});
const FireWall = ({ruleName, filterWidth, toleranceTime, banTime, outDateTime}) => {
    assert(ruleName);
    assert(filterWidth);
    assert(toleranceTime);
    assert(banTime);
    assert(outDateTime);
    const ipTable = new Map();
    const currentCodePage = child_process.execSync('chcp').toString('binary').match(/\d+/gi)[0];
    try {
        child_process.execSync(`netsh advfirewall firewall show rule name=${ruleName}`)
    } catch (e) {
        child_process.execSync(`netsh advfirewall firewall add rule name=${ruleName} dir=in action=block remoteip=197.233.12.76`)
    }
    const getMedian = values => {
        if (values.length === 0) return 0;
        values.sort((a, b) => a - b);
        const half = Math.floor(values.length / 2);
        if (values.length % 2)
            return values[half];
        return (values[half - 1] + values[half]) / 2.0;
    };
    const flushOutdated = () => {
        for (let [key, val] of ipTable.entries()) {
            if ((Date.now() - val.lastVisitTime) > outDateTime) ipTable.delete(key);
        }
    };
    const updateFirewallRule = async (ipTable, rule) => {
        let ipString = '';
        for (let [key, val] of ipTable.entries()) {
            if (val.isBanned) ipString += key + ',';
        }
        const command = `netsh advfirewall firewall set rule name=${rule} new remoteip=${ipString.slice(0, -1)}`;
        try {
            await asyncExec(command, currentCodePage);
        } catch (error) {
            throw error;
        }
    };
    let flushInterval = setInterval(flushOutdated, outDateTime);         //Clear ipTable of outdated records every outDateTime
    const core = async ip => {
        const foundIp = ipTable.get(ip);
        if (!foundIp) {
            ipTable.set(ip, {
                lastVisitTime: Date.now(),
                intervals: [],
                isBanned: false
            });
        } else if (foundIp.isBanned) {
            if ((Date.now() - foundIp.lastVisitTime) > banTime) {
                ipTable.delete(ip);
                try {
                    await updateFirewallRule(ipTable, ruleName);
                } catch (error) {
                    throw error;
                }
            }
            return;
        } else {
            if (foundIp.intervals.length < filterWidth) { //Filter is not full
                foundIp.intervals.push(Date.now() - foundIp.lastVisitTime);
                ipTable.set(ip, {
                    lastVisitTime: Date.now(),
                    intervals: foundIp.intervals,
                    isBanned: false
                })
            } else {                                     //Filter is full
                if (getMedian(foundIp.intervals) > toleranceTime) { //acceptable median value
                    ipTable.set(ip, {
                        lastVisitTime: Date.now(),
                        intervals: [],
                        isBanned: false
                    })
                } else {
                    ipTable.set(ip, {
                        lastVisitTime: Date.now(),
                        intervals: [],
                        isBanned: true
                    });
                    try {
                        await updateFirewallRule(ipTable, ruleName);
                    } catch (error) {
                        throw error;
                    }
                }
            }
        }
    };
    return {
        setRuleName: newRuleName => ruleName = newRuleName,
        setFilterWidth: newFilterWidth => filterWidth = newFilterWidth,
        setToleranceTime: newToleranceTime => toleranceTime = newToleranceTime,
        setBanTime: newBanTime => banTime = newBanTime,
        startPeriodicFlush: interval => {
            interval = interval || outDateTime;
            if (flushInterval) clearInterval(flushInterval);
            flushInterval = setInterval(flushOutdated, interval);
        },
        stopPeriodicFlush: () => {
            clearInterval(flushInterval);
            flushInterval = null;
        },
        setFlushInterval: interval => flushInterval = interval,
        getFlushInterval: () => flushInterval,
        setParams: ({newRuleName, newFilterWidth, newToleranceTime, newBanTime}) => {
            ruleName = newRuleName;
            filterWidth = newFilterWidth;
            toleranceTime = newToleranceTime;
            banTime = newBanTime;
        },
        getParams: () => ({ruleName, filterWidth, toleranceTime, banTime}),
        core
    }
};
module.exports = FireWall;