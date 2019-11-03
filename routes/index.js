var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Facial Expression Detection' });
});

router.get('/facedetection/', function(req, res, next) {
  res.render('facedetection', {title:'Face Detection'});
});

router.get('/ageandgender/', function(req, res, next) {
  res.render('ageandgender', {title:'Age and Gender Detection'});
});


module.exports = router;
