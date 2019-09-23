const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postComment: String,
  author: { type: String, default: "Author"},
  dateCreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Comment", commentSchema);
