const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender : {
        type : mongoose.Schema.Types.ObjectId , ref :'users'
    },
    receiver : {
        type : mongoose.Schema.Types.ObjectId , ref :'users'
    },
    text : String,
    file : String,
},
{timestamps: true}
);

const Message = mongoose.model('messages', MessageSchema);
module.exports = Message;