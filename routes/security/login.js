var express = require('express');
var router = express.Router();
var usermodel = require('../../modules/model/user');
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

/* GET home page. */
router.get('/', function (req, res, next) {
    if(req.user){
        res.redirect('/');
    }else{
        res.render('security/login',{layout:null});
    }
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    function(req, res) {
        res.redirect('/');
    }
}));

passport.serializeUser(function (user, done) {
    done(null, user.username);
});

passport.deserializeUser(function (id, done) {
    var userOperations = new usermodel.userOperations();
    userOperations.findByUserName(
        id,
        function (error, user) {
            done(error, user);
        }
    );
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        var userOperations = new usermodel.userOperations();
        userOperations.authinticateUser(
            username,
            password,
            function (error, isAutinticated, user) {
                if (error) {
                    return done(null, false, { message: error });
                }
                if (isAutinticated) {
                    return done(null, user);
                }
            }
        )
    }
));

module.exports = router;