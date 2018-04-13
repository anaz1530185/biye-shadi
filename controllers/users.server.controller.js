
var mongoose = require('mongoose');
var user = require('./../models/User.js');
var errorHandler = require('./errors.server.controller');
var _ = require('lodash');

module.exports.createView = function(req, res){
  res.render('./../public/views/user/RegisterForm.ejs', {
          user: req.user || null,
          request: req
        });
};

module.exports.singleView = function(req, res){
  res.render('./../public/views/user/view.ejs', {
          user: req.user || null,
          request: req
        });
}

module.exports.listView = function(req, res) {
    user.find(function(err, data) {
      if (err) {
        return res.status(400).send({

          message: errorHandler.getErrorMessage(err)
    });
      }
      else {
        console.log("api called");

        res.render('./../public/views/user/allProfile.ejs', {
          user: req.user || null,
          request: req,
          users: data
        });
      }
    });
  
	
};



module.exports.list = function(req, res) {
  user.find(function(err, data) {
    if (err) {
      return res.status(400).send({

  				message: errorHandler.getErrorMessage(err)
  			});
    } else {
      console.log("api called");

      res.status(200).send(data);
    }
  });
};

module.exports.create = function(req, res) {
  var user = new user(req.body);
  user.user = req.user;
  user.save(function(err, data) {
    if (err) {
      return res.status(400).send({

  				message: errorHandler.getErrorMessage(err)
  			});
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.read = function(req, res) {
  res.json(req.user);
};


exports.delete = function(req, res) {
	var user = req.user;
	user.remove(function(err) {
		if (err) {
			return res.status(400).send();
		} else {
			res.json(user);
		}
	});
};


module.exports.update = function(req, res) {
  var user = req.user;

  	user = _.extend(user, req.body);

  	user.save(function(err) {
  		if (err) {
  			return res.status(400).send();
  		} else {
  			res.json(user);
  		}
  	});
};

exports.userByID = function(req, res, next, id) {
	user.findById(id).populate('user', 'email').exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load user ' + id));
		req.user = user;
		next();
	});
};


 

module.exports = _.extend(
	require('./users/users.authentication.server.controller'),
	require('./users/users.authorization.server.controller'),
	require('./users/users.password.server.controller'),
	require('./users/users.profile.server.controller')
);
