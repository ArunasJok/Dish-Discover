const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//Define the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    avatarUrl: {
        type: String,
        default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...' // Add a default base64 avatar
    },
    dietaryPreferences: {
        type: [String],
        default: []
    },
    allergies: {
        type: [String],
        default: []
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
}, { timestamps: true });

//Pre-save hook to hash the password before saving the user to the database
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const hashed = await bcrypt.hash(this.password, 10);
        this.password = hashed;
        return next();
    } catch (err) {
        return next(err);
    }
});

//Method to compare the password entered by the user with the hashed password in the database
userSchema.methods.comparePassword = async function (candidatePassword, next) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (err) {
        return next(err);
    }
};

module.exports = mongoose.model('User', userSchema);