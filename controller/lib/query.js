const { getNotes } = require("../../database/query");
const { noteListKeyboard } = require("./keyboards");
const { updateKeyboard } = require("./methods");

const notesPerPage=5

async function handleshowNotes(replyingUser,messageId,page) {
    const notes = await getNotes(replyingUser.db_id, notesPerPage, page);
    return updateKeyboard(replyingUser.id, messageId,"\u200B                           \u200BYOUR NOTES\u200B                     \u200B",  noteListKeyboard(notes, replyingUser, page,notesPerPage));
}
module.exports = { handleshowNotes}