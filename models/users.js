const mongoose = require("mongoose");
const posts = require("./posts");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  profileImage: {
    type: String,
    default: "/public/img/avatar1.png"
  },
  signupDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
