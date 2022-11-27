const moment = require('moment');

function formatPesan(username, text){
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
}

module.exports = {formatPesan}