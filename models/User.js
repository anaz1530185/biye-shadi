'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var   Schema = mongoose.Schema;
var   crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
    return (this.provider !== 'local' || (password && password.length > 6));
};

/**
 * User Schema
 */
var UserSchema = new Schema({

    firstName: {
        type: String,
        trim: true,
        default: '',
        required: 'First Name required'
      },

    lastName: {
        type: String,
        trim: true,
        default: '',
        required: 'Last Name required'
      },

    displayName: {
        type: String,
        trim: true
    },
    
    fatherName: {
        type: String,
        trim: true,
        default: '',
        required: 'Fathers Name required'
      },
      
    motherName: {
        type: String,
        trim: true,
        default: '',
        required: 'Mothers Name required'
      },
    
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email required'
    },
    username: {
        type: String,
        trim: true,
        required: 'User Name required'
    },
     dateOfBirth: {
        type: String,
        trim: true,
        default: '',
        required: 'Date Of Birth required'
      },
       age: {
        type: String,
        trim: true,
        default: '',
        required: 'Age required'
      },
       gender: {
        type: String,
        trim: true,
        default: '',
        required: 'Gender required'
      },
       occupation: {
        type: String,
        trim: true,
        default: '',
        required: 'Occupation required'
      },
       religion: {
        type: String,
        trim: true,
        default: '',
        required: 'Religion required'
      },
       address: {
        type: String,
        trim: true,
        default: '',
        required: 'Address required'
      },
       contact: {
        type: String,
        trim: true,
        default: '',
        required: 'Contact required'
      },
       height: {
        type: String,
        trim: true,
        default: '',
        required: 'Height required'
      },
       skinColor: {
        type: String,
        trim: true,
        default: '',
        required: 'Skin color required'
      },
      hairColor: {
        type: String,
        trim: true,
        default: '',
        required: 'Hair color required'
      },
      eyeColor: {
        type: String,
        trim: true,
        default: '',
        required: 'Eye color required'
      },
      likes: {
        type: String,
        trim: true,
        default: '',
        required: 'Likes required'
      },
      disLikes: {
        type: String,
        trim: true,
        default: '',
        required: 'DisLikes required'
      },
      hobby: {
        type: String,
        trim: true,
        default: '',
        required: 'Hobby required'
      },
      interest: {
        type: String,
        trim: true,
        default: '',
        required: 'Interest required'
      },
      expert: {
        type: String,
        trim: true,
        default: '',
        required: 'Experts required'
      },
      favouriteColor: {
        type: String,
        trim: true,
        default: '',
        required: 'Favourite Color required'
      },
       favouriteFood: {
        type: String,
        trim: true,
        default: '',
        required: 'Favourite Food required'
      },
       bloodGroup: {
        type: String,
        trim: true,
        default: '',
        required: 'Blood Group required'
      },
       previousMaritalStatus: {
        type: String,
        trim: true,
        default: '',
        required: 'Previous Marital Status required'
      },
       medicalTestStatus: {
        type: String,
        trim: true,
        default: '',
        required: 'Medical Test Status required'
      },
    photo: {
        type: String,
        default: 'http://www.ee-ip.org/sites/default/files/default_images/default-user.png',
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    linkedin: {
        type: String,
        default: '',
        trim: true
    },
    twitter: {
        type: String,
        default: '',
        trim: true
    },
    password: {
        type: String,
        default: '',
        validate: [validateLocalStrategyPassword, 'Password should be longer'],
        required: 'Password required'
    },
    salt: {
        type: String
    },
    provider: {
        type: String,
        required: 'Provider is required'
    },
    providerData: {},
    additionalProvidersData: {},
    roles: {
        type: [{
            type: String,
            enum: ['user', 'admin']
        }],
        default: ['user']
    },
    created: {
        type: Date,
        default: Date.now
    },
    /* For reset password */
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
    if (this.password && this.password.length > 6) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }

    next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha1').toString('base64');
    } else {
        return password;
    }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

var User = mongoose.model('User', UserSchema, 'users');
module.exports = User;
