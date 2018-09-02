'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('./../controllers/users.server.controller');

	// Setting up the users profile api
	app.route('/users/me').get(users.me);
	app.route('/users/:userId').get(users.read);
	app.route('/users/:userId').put(users.update);
	app.route('/users/accounts').delete(users.removeOAuthProvider);

	// Setting up the users password api
	app.route('/users/password').post(users.changePassword);
	app.route('/auth/forgot').post(users.forgot);
	app.route('/auth/reset/:token').get(users.validateResetToken);
	app.route('/auth/reset/:token').post(users.reset);

	// Setting up the users authentication api
	app.route('/auth/signup').post(users.signup);
	app.route('/auth/signin').post(users.signin);
	app.route('/auth/signout').get(users.signout);

	// Routes to user views
	app.route('/signin').get(users.signinView);
	// Finish by binding the user middleware
	app.param('userId', users.userByID);
		app.route('/signup').get(users.signupView);
			app.route('/home').get(users.HomeView);
		

 app.route('/api/users')
	.get(users.list)
	.post(users.requiresLogin, users.create);

  app.route('/api/users/:userId')
	.get(users.read)
    .delete(users.requiresLogin, users.delete);
    
	app.route('/api/users/edit/:userId')
	.get(users.read)
	.put(users.update);
	
	//updating profile route
app.route('/user-profile/:userId').get(users.requiresLogin,users.updateView);


app.route('/allProfile').get(users.requiresLogin,users.listView);
app.route('/users/RegisterForm').get(users.createView);
app.route('/user/:userId').get(users.singleView);
app.route('/search').get(users.search);

//ANAZ
app.route('/recent').get(users.recent);

app.param('userId', users.userByID);


}
