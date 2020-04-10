//jshint esversion:6
// https://lodash.com/   Library to deal with strings

// Require modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
var _ = require('lodash');

const app = express();

// Conect to MongoDB
mongoose.connect("mongodb://localhost:27017/blogDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// use ejs as view engine
app.set('view engine', 'ejs');
// app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views/partials/')]);

// Create posts
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// let posts = [];

// Create the document's schema
const postSchema = {
  title: String,
  content : String
};

//Create a mongoose model based on the schema
//Mongoose model is usually Capitalized
const Post = mongoose.model("Post", postSchema);

// //Create standard Posts
// const post1 = new Post({
//   item: "Welcome to your todolist!"
// });
// const post2 = new Post({
//   item: "Hit the + button to add new item."
// });
// const post = new Post({
//   item: "<-- Hit this to delete and item"
// });



app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    res.render("home.ejs", {
      homeContent: homeStartingContent,
      posts: posts
    });
  });
  // console.log(posts);
});


//Source: https://expressjs.com/en/guide/routing.html
app.get('/posts/:postId', function (req, res) {
  // console.log(req.params.postId);
  const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId}, function(err, post){
      res.render("post.ejs", {
        title: _.lowerCase(_.toLower(post.title)),
        content: _.lowerCase(_.toLower(post.content))
      });
  });
  // posts.forEach(function(post){
  //   const postTitle = _.lowerCase(_.toLower(post.title));
  //   console.log(postTitle);
  //   const postId = _.lowerCase(_.toLower(req.params.postId));
  //   if (postTitle === postId){
  //     res.render("post.ejs", {
  //       sendPost: post
  //     });
  //   }
  // });
});

app.get("/about", function(req, res){
  res.render("about.ejs", {
    aboutContent: aboutContent
  });
});

app.get("/contact", function(req, res){
  res.render("contact.ejs", {
    contactContent: contactContent
  });
});

app.get("/compose", function(req, res){
  res.render("compose.ejs");
});

app.post("/compose", function(req, res) {
    const post = new Post({
      title: req.body.postTitle,
      content: req.body.postBody
    });
    post.save(function(err){
      if (!err){
        res.redirect("/");
      }
    });
    // res.redirect("/compose");
    // posts.push(userPost);
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
