const express = require('express');
const User = require('../core/users');
const router = express.Router();


//creating an user object
const user = new User();


//get the index page

router.get('/', (req, res, next) => {
    //checking if the user user is logged in then serving him the homepage
    let user = req.session.user;
    if(user){
        res.redirect('/home');
        return;
    }
    res.render('index',{title: "my application"});
})

//get Home page
router.get('/home', (req, res, next) => {
    let user = req.session.user;
    if(user) {
        res.render('home', {opp:req.session.opp, name:user.username});
        return;
    }
    res.redirect('/');
});


//posting login data
router.post('/login', (req, res, next) => {
    user.login(req.body.username, req.body.password, function(result) {
        if(result) {
            req.session.user = result;
            req.session.opp = 1;
            res.redirect('/home');
        } else {
            res.send('Username/Password is incorrect!');
        }
    })
});


router.post('/register', (req, res, next) => {
    let userInput = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };
    user.create(userInput, function (lastId) {
        if(lastId) {
            user.find(lastId, function(result) {
                req.session.user = result;
                req.session.opp = 0;
                res.redirect('/home');
            });
        } else {
            console.log('Error creating a new user');
        }
    });
});







module.exports = router;

