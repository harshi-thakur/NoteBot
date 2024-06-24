const { default: mongoose } = require("mongoose");
const cheerio = require('cheerio');

const noteSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    title: String,
    content: {
        type: mongoose.Schema.Types.Mixed,
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    updated_date: {
        type: Date,
        default: Date.now
    },
    remind_date: {
        type: Date,
        default: null
    },
    archived: {
        type: Boolean,
        default: false
    },
    trashed: {
        type: Boolean,
        default: false
    }
});

const userSchema = new mongoose.Schema({
    tel_id: Number,
    user_name: String,
    email: String,
    password: String,
});

const users = mongoose.model('users', userSchema);
const notes = mongoose.model('notes', noteSchema);


async function getTotalCount(db_id) {
    try {
        const totalNotes = await notes.countDocuments({ user_id: db_id });
        return totalNotes;
    } catch (error) {
        console.error('Error:', error);
    }
}
async function getNotes(db_id, notesPerPage, page) {
    const skip = (page - 1) * notesPerPage;
    try {
        const db_notes = await notes.where("user_id").equals(db_id)
            .where("archived").equals(false)
            .where("trashed").equals(false)
            .sort({ updated_date: -1 })
            .select("_id title")
            .skip(skip)
            .limit(notesPerPage)
            .exec();
        return db_notes;

    } catch (err) {
        console.error('Error', err);
    }
}

async function isUserExist(userId) {
    try {
        const user = await users.where("tel_id").equals(userId)
            .select("_id user_name")
            .exec();
        return user[0];
    } catch (err) {
        console.error("Error: ", err);
    }
}
async function getUserVerify(userId, email, password) {
    try {
        const user = await users.findOne({ email: email });
        if (user && user.password === password) {
            user.tel_id = userId;
            await user.save();
            return user;
        } else
            return "";
    } catch (err) {
        console.error(err);
    }
}
async function saveNote(db_id, title, content, time) {
    try {
        await notes.create({
            user_id: db_id,
            title: title,
            content: {
                time: Date.now(),
                blocks: [{
                    type: 'paragraph',
                    data: {
                        text: content,
                    }
                },
                ],
                version: "2.29.1",
            },
            remind_date: time ? time : null,    
        });
    }
    catch (err) {
        console.error("Error", err);
    }
}
async function deleteNote(db_id, note_id) {
    await notes.findOneAndDelete({ _id: note_id });
}
async function displayNote(note_id) {
    const noteObj = await notes.findById(note_id).exec();
    const{ content}=noteObj;
    if (typeof content === 'string')
        return content;
    else
        return renderContent(content);
}
function renderContent(content) {
    let plainText = '';
    const { blocks } = content;
    blocks.forEach((tool) => {
        switch (tool.type) {
            case 'header':
                plainText += `${tool.data.text}\n`;
                break;
            case 'paragraph':
                plainText += `${tool.data.text}\n\n`;
                break;
            case 'checklist':
                tool.data.items.forEach((item, index) => {
                    plainText += `${item.checked ? '✅' : '⬜'} ${item.text}\n`;
                });
                plainText += '\n';
                break;
            case 'table':
                tool.data.content.forEach(row => {
                    row.forEach(cell => {
                        plainText += cell + '\t';
                    });
                    plainText += '\n';
                });
            case 'list':
                tool.data.items.forEach((item, index) => {
                    plainText += `${index + 1}. ${item}\n`;
                })
            default:
                break;
        }
    });
    if(plainText.trim()=="")
        return "Note Format incompatible with bot version😔";
    function htmlToString(html) {
        const $ = cheerio.load(html);
        return $('body').text();
    }
    const Text = htmlToString(plainText);
    // console.log(plainText); // Output: This is bold text.

    return Text.trim();
}

async function getRemindNotes() {
    const remindNotes = await notes.aggregate([
        {
            $match: {
                remind_date: { $ne: null } // Filter notes with non-null remind_date
            }
        },
        {
            $lookup: {
                from: "users", // Collection name of the users
                localField: "user_id",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user" // Deconstruct the user array created by $lookup
        },
        {
            $project: {
                _id: 1,
                title: 1,
                content: 1,
                created_date: 1,
                updated_date: 1,
                remind_date: 1,
                archived: 1,
                trashed: 1,
                tel_id: "$user.tel_id"
            }
        }
    ]).exec();
    return remindNotes;
}

module.exports = { getNotes, getTotalCount, getUserVerify, saveNote, deleteNote, displayNote, isUserExist, getRemindNotes };