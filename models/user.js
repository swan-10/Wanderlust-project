const mongoose  = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    }                      // passportLocalMongoose adds username and password automatically with hash and salt
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);