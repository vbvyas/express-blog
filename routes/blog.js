var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/express-blog');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', function callback(){});

var articleSchema = mongoose.Schema({
  title: {type: String, required: true, trim: true},
  author: {type: String, required: true, trim: true},
  content: String
});

var Article = mongoose.model('Article', articleSchema);

exports.home = function(req, res){
  Article.find({}, function(err, articles){
    if (err){
      console.log("exports.home error:", err);
      res.render('home', { title: "My Blog", articles: [{ title: "Test", author: "Test", content: "Test" }] });
    }
    else{
      res.render('home', { title: "My Blog", articles: articles });
    }
  });
};

// handler for form submitted from homepage
exports.home_post_handler = function(req, res){
  var article = new Article(req.body);

  article.save(function (err, article){
    if (err) {
      console.log("ERROR: ", err);
    } else { 
      console.log('saved:', article);
    }
  });

  // redirect to homepage
  res.redirect('/');
};

exports.articles = function(req, res){
  Article.find({}, function(err, articles){
    for (var i = 0; i < articles.length; i++){
      console.log(articles[i]);
    }
    res.render('articles', { title: "Articles", articles: articles });
  });
};

exports.article = function(req, res){
  console.log("params id:", req.params.id);
  Article.findById(req.params.id, function(err, article){
    if (err){
      console.log("ERROR:", err);
      console.log("Cannot retrieve article with id:", req.params.id);
      res.send("Cannot retrieve article with id:", req.params.id);
    } else {
      console.log(article);
      res.render('article', { title: "Article", article: article });
    }
  });
};
