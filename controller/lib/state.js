const { getUserVerify, saveNote } = require("../../database/query");
const { startKeyboard, remindOptions } = require("./keyboards");
const { deleteMessage, sendMessage } = require("./methods");
const { updateUser } = require("./users");



async function handleAskVerify(messageText, replyingUser, messageId) {
    const email = messageText.substring(0, messageText.indexOf(' '));
    const password = messageText.substring(messageText.indexOf(' ') + 2, messageText.length - 1);
    const check = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (check) {
        const user = await getUserVerify(replyingUser.id, email, password);
        if (user) {
            replyingUser.db_id = user._id;
            replyingUser.user_name = user.user_name;
            replyingUser.state = "";
            await deleteMessage(replyingUser.id, messageId);
            await sendMessage(replyingUser.id, "Let me keep your credentials secret");
            return await sendMessage(replyingUser.id, `Ohhh... How can I not recognize U ${user.user_name}`, startKeyboard);
        }
        else {
            updateUser.deleteUser(replyingUser.id);
            return await sendMessage(replyingUser.id, 'Email and password does not match \nCheck it and Reply /start to try again');
        }
    }
    else {
        updateUser.deleteUser(replyingUser.id);
        return await sendMessage(replyingUser.id, 'Invalid Email\nCheck it and Reply /start to try again');
    }
}

async function handleAskNote(messageText, replyingUser) {
    const title = messageText.substring(0, messageText.indexOf('\n'));
    const content = messageText.substring(messageText.indexOf('\n') + 1);
    try {
        if (title && content) {
            replyingUser.state = "ask_remind";
            replyingUser.title = title;
            replyingUser.content = content;
            return sendMessage(replyingUser.id, `Do you want to set reminder `, remindOptions);
        }
        else
            return sendMessage(replyingUser.id, "Format went wrong .\nClick Here /createnote and try again");
    } catch (error) {
        return sendMessage(replyingUser.id, "Failed to Save");
    }
};
async function handleSaveNote(replyingUser, time) {
    var pattern = /^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])\s([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    // Test the date string against the pattern
    if (true) {
        await saveNote(replyingUser.db_id, replyingUser.title, replyingUser.content, time);
        replyingUser.state = "";
        const [date, timing] = time.split(" ");
        const [y, m, d] = date.split("/");
        const [h, min] = timing.split(":");
        const remind = new Date();
        remind.setHours(Number(h));
        remind.setMinutes(Number(min));
        remind.setDate(Number(d));
        remind.setMonth(Number(m) - 1);
        remind.setFullYear(Number(y));
        const delay = remind.getTime() - Date.now();
        if (delay > 0 && delay < 300000000) {
            setTimeout(() => {
                return sendMessage(replyingUser.id, `❗Reminder:\n${replyingUser.title}\n${replyingUser.content}`);
            }, delay);
        }
        else{
            console.log("error");
        }
        sendMessage(replyingUser.id, "Message saved Successfully 👍");
    }
    else {
        await saveNote(replyingUser.db_id, replyingUser.title, replyingUser.content);
        sendMessage(replyingUser.id, "Message saved Successfully 👍 but reminder not set invalid date");
    }
}
async function handleStates(messageText, replyingUser, messageId) {
    const userState = replyingUser.state;
    switch (userState) {
        case "ask_verify":
            return handleAskVerify(messageText, replyingUser, messageId);
        case "ask_note":
            return handleAskNote(messageText, replyingUser);
        case "ask_time":
            return handleSaveNote(replyingUser, messageText);
        default:
            updateUser.deleteUser(replyingUser.id);
            return sendMessage(replyingUser.id, "Bot ran into unknown userstate");
    }
}
module.exports = { handleStates, handleSaveNote };