const { handleMessage } = require('./lib/message');
const { errorHandler } = require('./lib/helper');
const { handleUpdate } = require('./lib/update');
async function handler(req, method) {
    try {
        if (method === 'GET') {
            return "Hello GET";
        }
        const { body } = req;
        console.log(body);
        if(body){
        if (body.message) {
            await handleMessage(body.message);
            return "Success";
        }
        if(body.callback_query){
            await handleUpdate(body.callback_query);
            return "Success";
        }
    }
        return "Unknown request";
    } catch (err) {
        errorHandler(err, "mainIndexHandler");
    }
}

module.exports = { handler };