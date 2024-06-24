const { axiosInstance } = require("./axios");
const { errorHandler } = require("./helper");


function sendMessage(chatId, messageText, replyMarkup) {
    const payload = {
        chat_id: chatId,
        text: messageText,
        reply_markup: JSON.stringify(replyMarkup),
    };

    return axiosInstance.get("sendMessage", payload)
        .catch((ex) => {
            errorHandler(ex, "sendMessage", "axios");
        });
}
function updateKeyboard(chatId, messageId, messageText,replyMarkup) {
    const payload = {
        chat_id: chatId,
        message_id: messageId,
        text:messageText,
        reply_markup: JSON.stringify(replyMarkup),
    };

    return axiosInstance.get("editMessageText", payload)
        .catch((ex) => {
            errorHandler(ex, "editMessageText", "axios");
        });
}

function deleteMessage(chatId, messageId){
    const payload = {
        chat_id: chatId,
        message_id: messageId,
    };
    return axiosInstance.get("deleteMessage",payload)
    .catch((ex) => {
        errorHandler(ex, "deleteMessage", "axios");
    });
}

module.exports={sendMessage,updateKeyboard,deleteMessage};