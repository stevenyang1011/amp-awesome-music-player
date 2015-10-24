var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var UserSchema = new Schema({
    email: {
        type: String,
        trim: true,
        index: true,
        unique: true,
        required: true,
        match: /.+\@.+\..+/
    },
    password: {
        type: String
        //validate: [
        //    function(password) {
        //        return password.length >= 6
        //    },
        //    'Password should be longer'
        //]
    },
    created: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ['Admin', 'Owner', 'User']
    },
    defaultPlaylist: {
        type: Object
    }
})

UserSchema.methods.authenticate = function(password) {
    return this.password === password
}

mongoose.model('User', UserSchema);