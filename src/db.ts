import mongoose, { model, Schema } from 'mongoose';

mongoose.connect('mongodb+srv://adarsh:Adarsh%408848@adarsh.nxqsrof.mongodb.net/second-brain-app')

const UserSchema = new Schema({
    username: {type: String, unique: true},
    password: String,
})

export const UserModel = model('User', UserSchema);

const ContentSchema = new Schema({
    title: String,
    link: String,
    tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}],
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
})

export const ContentModel = model('Content', ContentSchema);

const LinkSchema = new Schema({
    hash: String,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true},
})

export const LinkModel = model('Link', LinkSchema);