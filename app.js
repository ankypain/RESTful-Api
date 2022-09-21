const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");

mongoose.connect("mongodb://localhost:27017/wikiDB");

const app = express();

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = new mongoose.model("Article", articleSchema);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.set("view engine", "ejs");

app.route("/*").get((req, res) => {
  res.redirect("/articles");
});

app
  .route("/articles")
  .get(function (req, res) {
    res.render("home");
  })

  .post(function (req, res) {
    const article = new Article();
    article.title = _.kebabCase(req.body.title);
    article.content = req.body.content;
    article.save();

    Article.find({}, function (err, foundArticles) {
      res.send(foundArticles);
    });
  });

app
  .route("/articles/:topic")

  .get(function (req, res) {
    const topicName = req.params.topic;

    Article.findOne({ title: topicName }, function (err, foundArticle) {
      if (!err) {
        res.send(foundArticle);
      } else {
        console.error(err);
      }
    });
  })
  .put(function (req, res) {
    Article.update(
      { title: topicName },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err) {
        if (!err) {
          console.log("successfully updated");
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.update(
      { title: topicName },
      {
        $set: req.body,
      },
      function (err) {
        if (!err) {
          console.log("successfully updated!");
        }
      }
    );
  })
  .delete(function (req, res) {
    Article.Delete({ title: topicName }, function (err) {
      if (!err) {
        console.log("successfully deleted");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function (err) {
  console.log("connected to port successfully");
});
