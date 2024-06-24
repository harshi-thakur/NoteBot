const { errorHandler } = require("./helper");
const { updateUser } = require("./users");
const { handleStates } = require("./state");
const { handleStart, handleCommands } = require("./command");
const { sendMessage } = require("./methods");

async function handleMessage(messageObj) {
    const messageText = messageObj.text || "";
    if (!messageText) {
        errorHandler("No message text", "handleMessage");
        return "";
    }
    try {
        const chatId = messageObj.chat.id;
        const messageId=messageObj.message_id;
        if (messageText === "/start") 
            return handleStart(chatId);
        else {
            const replyingUser = updateUser.isUser(chatId);
            if (replyingUser) {
                if (replyingUser.state) 
                    return handleStates(messageText,replyingUser,messageId);     
                else 
                    return handleCommands(messageText,replyingUser);
            }
            else
                return sendMessage(chatId, 'Click here /start to Begin....\n I Like Commands not statement');
        }
    } catch (err) {
        errorHandler(err, "handleMessage");
    }
}

module.exports = { handleMessage };
