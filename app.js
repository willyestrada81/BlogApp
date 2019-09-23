//REQUIRE DEPENDENCIES PAQUEGES
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const path = require("path");
const moment = require("moment");
const methodOverride = require("method-override"); // This is required to make put requests to the DB

const PORT = process.env.PORT || 3000;
// REQUIRE THE DATA MODULES

//MONGO DB CONFIG
const mongoDB = process.env.MongoURI;

//CONNECT TO MONGODB USING MONGOOSE
mongoose.connect(mongoDB, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err)); 

const User = require("./models/users");
const Comments = require("./models/comments");
const Blog = require("./models/posts");

//CREATE EXPRESS APP
const app = express();



// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Override Method Setup *** Needed for Put Requests
app.use(methodOverride("_method"));
//Serve public files
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));


mongoose.set("useFindAndModify", false);


//Mongoose Schema Config setup in the models directory

// CONFIG MOMENT JS TO FORMAT DATES

app.get("/", (req, res) => {
  Blog.find({}, (err, posts) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { posts: posts });
    }
  })
    .sort({ _id: -1 })
    .limit(6);
});

app.get("/blogs", (req, res) => {
  Blog.find({}, (err, posts) => {
    if (err) {
      console.log(err);
    } else {
      res.render("posts", { posts: posts });
    }
  });
});

app.get("/blogs/new", (req, res) => {
  res.render("newPost");
});

app.post("/blogs", (req, res) => {
  const post_title = req.body.post_title;
  const post_author = req.body.post_author;
  const post_image = req.body.post_image;
  const post_body = req.body.post_body;

  Blog.create(
    {
      title: post_title,
      author: post_author,
      body: post_body,
      image: post_image
    },
    (err, newPost) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/blogs");
      }
    }
  );
});

//Register ROUTE
app.get('/register', (req, res) => {
  res.render('loginForm')
})
//Show specific detail of every post selected by the _id
app.get("/blogs/:id", (req, res) => {
  // FIND THE CAMPGROUND BY THE ID
  //RENDER THE SHOW TEMPLATE WITH THAT CAMPGROUND

  Blog.findById(req.params.id).populate("comments").exec((err, post) => {
    if (err) {
      console.log(err);
    } else {
      res.render("postDetails", {post: post});
    }
  });
});

app.get("/blogs/:id/edit", (req, res) => {
  // FIND THE CAMPGROUND BY THE ID
  let post_id = req.params.id;

  //RENDER THE SHOW TEMPLATE WITH THAT CAMPGROUND
  Blog.findById(
    {
      _id: post_id
    },
    (err, post) => {
      if (err) {
        console.log(err);
      } else {
        res.render("editPost", {
          post: post
        });
      }
    }
  );
});
//UPDATE ROUTE *** add ?_method=PUT after ejs in the form action
app.put("/blogs/:id", (req, res) => {
  let post_id = req.params.id;
  const post_title = req.body.post_title;
  const post_author = req.body.post_author;
  const post_image = req.body.post_image;
  const post_body = req.body.post_body;

  //Find first the existing object in DB with the _id , then redirect
  Blog.findByIdAndUpdate(
    post_id,
    { title: post_title, author: post_author, body: post_body, image: post_image },
    (err, updatedPost) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect(`/blogs/${post_id}`);
      }
    }
  );
});

app.delete("/blogs/:id", (req, res) => {
  let post_id = req.params.id;
  //Find first the existing object in DB with the _id , then DLETE, then redirect
  Blog.findByIdAndRemove(post_id, err => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/blogs");
    }
  });
});

//==================================================
//==================================================
//COMMENTS ROUTES
app.get("/blogs/:id/comments/new", (req, res) => {
  Blog.findById(req.params.id, (err, foundPost) => {
    if (err) {
      console.log(err);
    } else {
      res.render("newComment", { post: foundPost });
    }
  });
});

//ROUTE TO POST COMMENTS
app.post("/blogs/:id", (req, res) => {
  //Lokup blog by id    
  Blog.findById(req.params.id, (err, foundPost) => {
      if(err){
          console.log(err)
      }else{
             //create new comment
             Comments.create({postComment: req.body.postComment}, (err, newComment) => {
                 if(err){
                     console.log(err)
                 }else{
                     foundPost.comments.push(newComment)
                     foundPost.save()
                     res.redirect('/blogs/' + foundPost._id)
                     console.log(newComment)
                 }
             })
             //create new comment to the post
             //redirect to post details
           }
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
