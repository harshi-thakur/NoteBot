const { sendMessage } = require("../controller/lib/methods");
const { displayNote, getRemindNotes } = require("./query");
// Function to schedule a reminder
function scheduleReminder(note) {
    const modify = note.remind_date.toString().slice(0, -1);
    const remindTime = new Date(modify);
    const delay = Math.floor(remindTime.getTime() - Date.now());
    if (delay > 0&&delay<30000) {
        const content = displayNote(note._id);
        setTimeout(async () => {
            sendMessage(note.tel_id, "❗Reminder:\n"+note.title+"\n"+content);
        }, delay);
    }
}

async function startReminder() {
    const notes = await getRemindNotes();
    notes.forEach(async note => {
        scheduleReminder(note);
    });
}
module.exports = { scheduleReminder, startReminder }; 