module.exports = {
    getCurrentDateTime: () => {
        const date = new Date();
        return date.toLocaleDateString() + ' ' + ('0' + date.toLocaleTimeString()).slice(-8);
    },
    getDemoDateTime: hours =>{
        const date = new Date();
        date.setTime(Date.now()+hours*60*1000);
        return date.toLocaleDateString() + ' ' + ('0' + date.toLocaleTimeString()).slice(-8);
    }
};