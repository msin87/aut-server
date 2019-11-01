
module.exports = {
    getCurrentDateTime: () => {
        const date = new Date();
        return date.toLocaleDateString() + ' ' + ('0' + date.toLocaleTimeString()).slice(-8);
    },
    getDemoDate: hours =>{
        const date = new Date();
        date.setTime(Date.now()+hours*60*60*1000);
        return `${date.getFullYear()}-${('0'+(date.getMonth()+1)).slice(-2)}-${('0'+date.getDate()).slice(-2)}`
    }
};