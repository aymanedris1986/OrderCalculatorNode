var pgpool = require('../db/pgpool');

function User() {
    this.username;
    this.email;
    this.name;
    this.password;
}

function DBTomModelConverter(db) {
    var user = new User();
    user.username = db.user_name;
    user.email = db.email;
    user.name = db.name;
    return user;
}

function UserOperations() {

    this.create = function (user, callback) {
        pgpool.query(
            'insert into oc."users" (user_name,password,email,name) values ($1,$2,$3,$4)',
            [user.username, user.password, user.email, user.name],
            function (err, res) {
                if (err) {
                    callback(err, false);
                    console.log(JSON.stringify(err));
                    return;
                }
                console.log('newly create user : ' + JSON.stringify(res));
                callback(null, true);
            }
        )
    }

    this.authinticateUser = function (userName, password, callback) {
        pgpool.query('SELECT * FROM oc."users" where user_name = $1', [userName], function (err, res) {
            if (err) {
                console.log('error occured');
                callback(err, false, null);
                return;
            }
            var dbUser = res.rows[0];
            if (dbUser) {
                console.log('user from DB : ' + JSON.stringify(dbUser));
                if (dbUser.password === password) {
                    var user = DBTomModelConverter(dbUser);
                    callback(null, true, user);
                    return;
                }
                console.log('password not match');
                callback('password not match', false, null);
                return;
            }
            console.log('user not found');
            callback('user not found', false, null);
        });

    }

    this.findByUserName = function (userName, callback) {
        pgpool.query('SELECT * FROM oc."users" where user_name = $1', [userName], function (err, res) {
            if (err) {
                console.log('error occured');
                callback(err,  null);
                return;
            }
            var dbUser = res.rows[0];
            if (dbUser) {
                console.log('user from DB : ' + JSON.stringify(dbUser));
                var user = DBTomModelConverter(dbUser);
                callback(null, user);
                return;
            }
            console.log('user not found');
            callback('user not found',null);
        });

    }
}




module.exports.userOperations = UserOperations;
module.exports.user = User;