const mongoose = require('mongoose');




const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    imgDescribe: {
        type: String,
    },
    content : {
        type: String,
        required: true,
    },
    userManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true,
}
);

const BlogModel = mongoose.model('Blog',BlogSchema);
module.exports = BlogModel;