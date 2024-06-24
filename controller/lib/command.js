const { isUserExist } = require("../../database/query");
const { startKeyboard } = require("./keyboards");
const {sendMessage } = require("./methods");
const { updateUser } = require("./users");
const space="\u200B               \u200B";
async function handleStart(chatId) {
    await sendMessage(chatId, "Hey There!...");
   
    let user=updateUser.isUser(chatId);
    if(!user){
        updateUser.setUser(chatId,"");
        user=updateUser.isUser(chatId);
        const db_user= await isUserExist(chatId);
        if(db_user){
            console.log(db_user);
            user.user_name=db_user.user_name;
            user.db_id=db_user._id;
        }
        else{
            updateUser.setUser(chatId, "ask_verify");
            await sendMessage(chatId, 'Looks like you are new here ...');
            return await sendMessage(chatId, 'Send your email and password to verify\n Eg:\n email: user@example.com \n Password: User@123 \n Type : user@example.com "User@123"');
        }  
    }
    user.state="";
    await sendMessage(chatId, `Hello ${user.user_name}`);
    return sendMessage(chatId, `${space}   Note Bot Welcomes U 🤖${space}`,startKeyboard);
}

function handleCreate(replyingUser) {
    replyingUser.state = "ask_note";
    return sendMessage(replyingUser.id, 'Send your note \n Title goes in first line (Press Enter)\n Content goes in second line');
}


function handleCommands(messageText,replyingUser) {
    const command = messageText;
    switch (command) {
        case "/createnote":
            return handleCreate(replyingUser);
        default:
            return sendMessage(replyingUser.id, 'New to this command');
    }
}
module.exports = { handleCommands,handleStart,handleCreate };