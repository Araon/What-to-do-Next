const pool = require('./pool');
const bcrypt = require('bcrypt');


function User() {};

User.prototype = {
    //Finding user data by id or username
    find : function (users = null, callback) {
        //if the user variable is defined
        if(users) {
            // if user = number then return field = id or if user = string retrun field = fullname.
            var field = Number.isInteger(users) ? 'id' : 'username';
        }

        let sql = `SELECT * FROM users WHERE ${field} = ?`;

        pool.query(sql, users, function (err, result) {
            if(err) throw err
            
            if(result.length) {
                callback(result[0]);
            }else {
                callback(null);
            }
        });
    },

    //Function to insert data into the databse (creating a new user)
    //Body is an object
    create : function(body, callback)
    {
        var pwd = body.password;
        //hashing the password before inserting into the database.
        body.password = bcrypt.hashSync(pwd, 10);

        //this array will contain the valus of the fields
        var bind = [];
        // looping through the attributes of the object and pusing the value into the bind array
        for(prop in body){
            bind.push(body[prop]);
        }
        //setting up the sql query
        let sql = `INSERT INTO users(username, email, password) VALUES (?,?,?)`;
        //using (?,?,?) as a place holder and executing the query string using the vales from the bind array
        pool.query(sql, bind, function(err, result) {
            if(err) throw err;
            //retuning the last inserted id, if there is no error
            callback(result.insertId);
        });
    },


    login: function (username, password, callback)
    {
        this.find(username, function (users) {
            //if there is a user by this username
            if(users) {
                //password checking
                //oh! hi mark
                if(bcrypt.compareSync(password, users.password)) {
                    //gib baccc his data
                    callback(users);
                    return;
                }
            }
            //if username or password is wrong then return null
            callback(null);
        });
    }

}

module.exports = User;