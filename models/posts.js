const mongoose = require('mongoose');
const comment = require('./comments')


const blogSchema = new mongoose.Schema({
  title: String,
  author: { type: String, default: "William" },
  body: String,
  image: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2367&q=80"
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Blog", blogSchema);
