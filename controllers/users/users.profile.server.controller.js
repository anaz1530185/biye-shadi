'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};

/**
 * Show the current article
 */
exports.read = function(req, res) {
	res.json(req.profile);
};
module.exports.createView = function(req, res){
  res.render('./../public/views/user/RegisterForm.ejs', {
          user: req.user || null,
          request: req
        });
};

//update view
module.exports.updateView = function(req, res){
  res.render('./../public/views/user/updateProfile.ejs', {
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
    User.find(function(err, data) {
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

module.exports.search = function(req, res) {
	//console.log(req.query);
    User.find(req.query,function(err, data) {
      if (err) {
        return res.status(400).send({

          message: errorHandler.getErrorMessage(err)
    });
      }
      else {
        console.log("api called");

        res.render('./../public/views/user/searchResults.ejs', {
          user: req.user || null,
          request: req,
          users: data
        });
      }
    });
  
	
};


module.exports.list = function(req, res) {
  User.find(function(err, data) {
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

// exports.userByID = function(req, res, next, id) {
// User.findById(id).populate('user', 'email').exec(function(err, user) {
// if (err) return next(err);
// if (!user) return next(new Error('Failed to load user ' + id));
// req.user = user;
// next();
// 	});
// };

//My code for recently profile added ANAZ

module.exports.recent = function(req, res) {
        User.find({}).sort('-created').limit(5).exec(function(err, data){
          if (err) 
          {
            return res.status(400).json({
               message: errorHandler.getErrorMessage(err)
             })
          }
          res.json(req.profile,{
            user: req.user || null,
            request: req,
            users: data
          });
        
        });
};


