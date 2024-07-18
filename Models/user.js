const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: {
     type: String, 
     unique: true, 
     required: true 
  },
  email : {
    type: String,
    unique: true, 
    required: true
  }
});

userSchema.plugin(passportLocalMongoose); // added the username and password

module.exports = mongoose.model("User", userSchema);
