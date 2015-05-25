var express = require('express');
var router = express.Router();


var mongoose  = require('mongoose');
mongoose.connect('mongodb://localhost/test', function(err){
    if(err) console.log("Could not connect to mongoose");
    else console.log("Successfully connected to mongoose");
});

var CalendarModel = mongoose.model('Calendar', {
    key: String,
    startTime : Date,
    endTime: Date,
    title: String
});

/* Mongo Access */

router.post('/calendar', function(req, res){
    (new CalendarModel(req.body)).save(function(err, result){
        if(err) res.status(500).json({message: 'Sorry! something broke'});
        else res.status(201).json(result);
    });
});

router.get('/calendar/:key', function(req, res, next) {
    // findOne() gives one object, find() gives an array of objects
    CalendarModel.findOne({key: req.params.key}, function(err, result){
        if(err) res.status(500).json({message: 'Sorry! something broke in get'});
        else {
            console.log(result);
            res.status(200).json(result);
        }
    });
});

router.get('/calendar', function(req, res, next) {
    CalendarModel.find(function(err, result){
        if(err) res.status(500).json({message: 'Sorry! something broke in get'});
        else res.status(200).json(result);
    });
});

/* Go to Angular. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
