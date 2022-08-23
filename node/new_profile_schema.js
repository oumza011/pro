var mongoose = require('mongoose');

var newProfilSchema = mongoose.Schema({
    username: { type: String, require: true },
    password: { type: String, require: true },
    fname: { type: String, require: true },
    lname: { type: String, require: true },
    pic_profile: { type: String },
    old_password: { type: String },
    create_dtm: { type: Date },
    update_dtm: { type: Date }
})

var newProfileModel = mongoose.model('new_profile', newProfilSchema);
module.exports = newProfileModel;