import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    name: { type: String, required: true },
    group: { type: String, required: true },
    birthdate: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

export { User };