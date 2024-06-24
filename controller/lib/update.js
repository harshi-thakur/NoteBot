const { getTotalCount, displayNote, deleteNote } = require("../../database/query");
const { errorHandler } = require("./helper");
const { startKeyboard } = require("./keyboards");
const { updateKeyboard, sendMessage } = require("./methods");
const { handleshowNotes } = require("./query");
const { handleSaveNote } = require("./state");
const { updateUser } = require("./users");
const space="\u200B               \u200B";
async function handleUpdate(queryObj) {
    const messageObj = queryObj.message;
    const chatId = queryObj.message.chat.id;
    const messageId = queryObj.message.message_id;
    const replyingUser = updateUser.isUser(chatId);
    if (!(messageObj && queryObj.data)) {
        errorHandler("No message text", "handleMessage");
        return "";
    }
    try {
        const [query, page, noteId] = queryObj.data.split(" ");
        switch (query) {
            case "showNotes":
                return handleshowNotes(replyingUser, messageId, Number(page));
            case "showAllNotes":
                replyingUser.totalNotes = await getTotalCount(replyingUser.db_id);
                if (replyingUser.totalNotes) {
                    replyingUser.state = "get_all_notes";
                    return handleshowNotes(replyingUser, messageId, 1);
                }
                else {
                    replyingUser.state = "";
                    return updateKeyboard(replyingUser.id, messageId, "Nothing to show 🍃🍃");
                }
            case "pick":
                replyingUser.state = "get_options";
                return updateKeyboard(replyingUser.id, messageId,`${space} Do you want to do ? 🤔${space}`, options(noteId,Number(page)));
            case "open":
                replyingUser.state = "";
                const content  = await displayNote(page);//page as note id will need to format it later onnn
                return updateKeyboard(replyingUser.id, messageId, content);
            case "startPage":
                replyingUser.state = "";
                return updateKeyboard(replyingUser.id, messageId, `${space}   Note Bot Welcomes U 🤖${space}`, startKeyboard)
            case "createNote":
                replyingUser.state = "ask_note";
                return updateKeyboard(replyingUser.id, messageId, 'Send your note \n Title goes in first line (Press Enter)\n Content goes in second line');
            case "remindNote":
                if(page=='Y'){
                    replyingUser.state ="ask_time";
                    return updateKeyboard(replyingUser.id,messageId,'Enter the time(24 hour) in format "YYYY/MM/DD HH:MM" ');
                }
                else
                    return handleSaveNote(replyingUser);
            case "delete":
                replyingUser.state="";
                await deleteNote(replyingUser.db_id,page);
                return updateKeyboard(replyingUser.id, messageId, "Note deleted 👍");
        }
        return updateKeyboard(chatId, messageId, "Unknown query");
    }
    catch (err) {
        errorHandler(err, "handleQuery");
    }
}


module.exports = { handleUpdate }