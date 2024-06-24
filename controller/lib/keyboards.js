const startKeyboard = {
    inline_keyboard: [
        [{ text: 'Show All Notes 📒', callback_data: 'showAllNotes' }],
        [{ text: 'Create a Note 📝', callback_data: 'createNote' }],
    ],
};

options = (noteId, page) => {
    return {
        inline_keyboard: [
            [{ text: 'Open 📖', callback_data: `open ${noteId}` }],
            [{ text: 'Back ⬅️', callback_data: `showNotes ${page}` }, { text: 'Delete 🗑️', callback_data: `delete ${noteId}` }],
        ],
    }

}

const remindOptions = {
    inline_keyboard: [
        [{ text: 'Yes ✅', callback_data: `remindNote Y` }, { text: 'No ❌', callback_data: `remindNote N` }],
    ],
}

function noteListKeyboard(notes, replyingUser, page, notesPerPage) {
    const NoteList = notes.map((note, index) => [{ text: '✨ ' + note.title, callback_data: `pick ${page} ${note._id}` }]);//Note ki id honi chahiye
    if (page > 1) {
        NoteList.push([{ text: 'Back ⬅️', callback_data: `showNotes ${page - 1}` }]);
    }
    if (page == 1) {
        NoteList.push([{ text: 'Back ⬅️', callback_data: 'startPage' }]);
    }
    if (replyingUser.totalNotes > page * notesPerPage) {
        NoteList.at(-1).push({ text: 'Next ➡️', callback_data: `showNotes ${page + 1}` });
    }

    return { inline_keyboard: NoteList };
}

module.exports = { startKeyboard, noteListKeyboard, options, remindOptions };
