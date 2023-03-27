//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/wikiDB", {useNewUrlParser:true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

//Requests targetting all articles
app.route("/articles")

.get(function(req,res){
    Article.find({})
    .then(function(foundArticles){
        if(foundArticles){
            res.send(foundArticles);
        }
        else{
            res.send(err);
        }
        
    })
    .catch(function(err){
        console.log(err);
    });
})

.post(function(req,res){

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save()
    .then(function(err){
        if (!err){
            res.send("Successfully added a new article");
        }
        else {
            res.send(err);
        }
    })
    .catch(function(err){
        console.log(err);
    });
})

.delete(function(req,res){
    Article.deleteMany()
    .then(function(err){
        if(!err){
            res.send("Successfully deleted all articles");
        }
        else{
            res.send(err);
        }
    })
    .catch(function(err){
        console.log(err);
    });
    
});

//Requests targetting a specific article

app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title: req.params.articleTitle})
    .then(function(foundArticle){
        if(foundArticle) {
            res.send(foundArticle);
        }
        else{
            res.send("No Matching Article Found");
        }
    })
    .catch(function(err){
        console.log(err);
    });
})
.put(function(req,res){
    Article.findOneAndUpdate({title:req.params.articleTitle},
    {title:req.body.title, content: req.body.content},
    
    )
    .then(function(err){
        if (!err){
            res.send("Successfully updated article");
        }
    })
    .catch(function(err){
        console.log(err);
    });
})
.delete(function(req,res){
    Article.deleteOne({title:req.params.articleTitle})
    .then(function(err){
        if(!err){
            res.send("Successfully deleted the article");
        }
        else{
            res.send(err);
        }
    })
    .catch(function(error){
        console.log(error);
    });
});





app.listen(3000, function() {
  console.log("Server started on port 3000");
});