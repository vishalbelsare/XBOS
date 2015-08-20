var schedule = {};

// import config
var config = require('./config');
var mongo = require('mongoskin');

// setup MongoDB
var db = mongo.db(config.mongohost);
db.bind('schedules'); // bind to collection

schedule.list = function(success, error) {
    db.schedules.distinct("name", {}, function(err, found) {
        if (err || !found) {
            error(err);
        } else {
            success(found);
        }
    });
}

schedule.get = function(name, success, error) {
    db.schedules.findOne({name: name}, function(err, found) {
        if (err) {
            error(err);
        } else if (!found) {
            error(new Error("No schedule found"));
        } else {
            delete found._id;
            success(found);
        }
    });
}

schedule.save = function(sched, success, error) {
    db.schedules.update({name: sched.name}, sched, {upsert: true}, function(err, good) {
        if (err) {
            error(err);
        } else {
            success(good);
        }
    });
}

module.exports = schedule;
