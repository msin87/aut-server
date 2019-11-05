const Settings = require('../settings');
const child_process = require('child_process');
const codePage = require('legacy-encoding');
const ipTable = new Map();
const currentCodePage = child_process.execSync('chcp').toString('binary').match(/\d+/gi)[0];
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
try {
    child_process.execSync(`netsh advfirewall firewall show rule name='${Settings.firewall.ruleName}'`)
} catch (e) {
    child_process.execSync(`netsh advfirewall firewall add rule name='${Settings.firewall.ruleName}' dir=in action=block`)
}
const updateFirewallRule = async (ipTable, rule) => {
    let ipString = '';
    for (let [key, val] of ipTable.entries()) {
        if (!val.attemptsLeft) ipString += key + ',';
    }
    const command = `netsh advfirewall firewall set rule name='${rule}' new remoteip=${ipString.slice(0, -1)}`;
    try {
        await asyncExec(command, currentCodePage);
    } catch (error) {
        throw error;
    }
};
const FireWall = async ip => {
    const foundIp = ipTable.get(ip);
    if (!foundIp) {
        ipTable.set(ip, {
            attemptsLeft: Settings.firewall.attempts,
            lastVisitTime: Date.now(),
            isBanned: false
        });
    } else if (foundIp.attemptsLeft) {
        if ((Date.now() - foundIp.lastVisitTime) <= Settings.firewall.toleranceTime) {
            ipTable.set(ip, {
                attemptsLeft: foundIp.attemptsLeft--,
                lastVisitTime: Date.now(),
                isBanned: false
            })
        } else {
            ipTable.set(ip, {
                attemptsLeft: foundIp.attemptsLeft,
                lastVisitTime: Date.now(),
                isBanned: false
            })
        }
    } else {
        if ((Date.now() - foundIp.lastVisitTime) <= Settings.firewall.banTime) {
            if (!foundIp.isBanned) {
                try {
                    await updateFirewallRule(ipTable, Settings.firewall.ruleName);
                    ipTable.set(ip, {
                        attemptsLeft: 0,
                        lastVisitTime: foundIp.lastVisitTime,
                        isBanned: true
                    })
                } catch (error) {
                    throw error;
                }
            }
        } else {
            ipTable.delete(ip);
            try {
                await updateFirewallRule(ipTable, Settings.firewall.ruleName);
            } catch (error) {
                throw error;
            }
        }
    }
};
module.exports = FireWall;