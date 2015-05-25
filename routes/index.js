var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var Calendar = mongoose.model('Calendar', {
    startTime: String,
    endTime: String,
    startDate:String,
    date:String,
    content:String
});

router.post('/:id', function (req, res) {
    var id = req.params.id;

    Calendar.findOneAndUpdate({'startDate':id}, req.body, function (err, result){

       if (result === null) {

            (new Calendar(req.body)).save(function (err, result) {
               if (err) res.status(500).json({message: 'Something broke ... '});
                else res.status(200).json(result);
            });

       }
        else res.status(200).json(result);
         });
});

router.get('/:id', function (req, res) {
    var date  = req.params.id;
    Calendar.find({ 'date': date}, function (err, result) {
        console.log(result);
        if (err) res.status(500).json({ message: 'Something broke ... ' });
        else res.status(200).json(result);
    });
});

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
