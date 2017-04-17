var express = require('express');
var usermodel = require('../../modules/model/user');
var router = express.Router();

function validateSignUpData(req){
    var errors = null;
    return errors;
}

router.get('/', function (req, res, next) {
    if (req.user) {
        res.redirect('/');
    } else {
        res.render('security/signup');
    }
});

router.post('/', function (req, res, next) {
    var validationErrors = validateSignUpData(req);
    if(validationErrors){
        res.render('security/signup');
        return;
    }
    var user = new usermodel.user();
    var userop = new usermodel.userOperations();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    user.name = req.body.fullname;
    userop.create(
        user,
        function(error,iscreated){
            if(error){
                res.render('security/signup');
                return;
            }
            res.redirect('/');
        }
    )
});

module.exports = router;