var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/express-blog');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', function callback(){
});

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
    if (err) // TODO handle the error
    console.log('saved:', article);
  });

  // redirect to homepage
  res.redirect('/');
};

exports.articles = function(req, res){
  Article.find({}, function(err, articles){
    res.render('articles', { title: "Articles", articles: articles });
  });
};

exports.article = function(req, res){
  console.log("params id:", req.params.id);
  Article.findOne({id: req.params.id}, function(err, article){
    if (err){
      console.log("Cannot retrieve article with id:", req.params.id);
      res.rend("Cannot retrieve article with id:", req.params.id);
    }
    console.log(article);
    if (!article) res.render('article', { title: "Article", article: article });
  });
  /*
  Article.findOne({id: req.params.id}, function(err, article){
    res.render('article', { title: "Article"+req.params.id, article: article });
  });
  */
};