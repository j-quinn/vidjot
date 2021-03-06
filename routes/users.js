const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

// Load user model
require('../models/User');
const User = mongoose.model('users');

module.exports = router;

// User login route
router.get('/login', (req, res) => {
    res.render('users/login');
});

// User register route
router.get('/register', (req, res) => {
    res.render('users/register');
});

// Login form POST
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/register',
        failureFlash: true
    })(req, res, next);
});

// Logout form post
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', "You are now logged out");
    res.redirect('/users/login');
});

// Register form post
router.post('/register', (req, res) => {
    let errors = [];

    if (req.body.password != req.body.password2) {
        errors.push({ text: 'Passwords do not match' });
    }

    if (req.body.password.length < 4) {
        errors.push({ text: 'Password must be at least four characters' });
    }

    if (errors.length) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    req.flash('error_msg', 'Invalid email -- Email address is already registered');
                    res.redirect('/users/register');
                } else {

                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', "You are now registered");
                                    res.redirect('/users/login');
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                });
                        });
                    });
                }
            });
    }
});