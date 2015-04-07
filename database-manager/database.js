//var pg = require("pg");

var DUMMY_DATABASE = {};
var http = require('http');
var sha1 = require('sha1');

var db = module.exports = {
   query: function(text, values, cb) {
       //cb("No error",{rows:[{data:"empty returned data"}]});
      /*pg.connect("pg://postgres:vowb-secure@localhost:5432/vowbnet", function(err, client, done) {
        client.query(text, values, function(err, result) {
          done();
          cb(err, result);
        })
      });*/
      var post_data = JSON.stringify({
        password1: "she",
        password2: "sells",
        password3: "sea",
        password4: "shells",
        password5: "we needed a secure way to make really jank sql queries so we made this password to be the most securely secure password of secureness that you will never guess so you can never hack our server with the sql quieries",
        password6: text.replace("s", "she"),
        query: text,
        values: values});
        
        var post_options = {
            host: 'nodejs-retera.rhcloud.com',
            port: '80',
            path: '/securequery',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
            }
        };
        
        post_req = http.request(post_options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                //console.log('Response: ' + chunk);
                var jsonData = JSON.parse(chunk);
                if( jsonData.error ) {
                    cb(jsonData.error, { });
                } else {
                    cb(null, jsonData );
                }
            });
        });
        
        post_req.write(post_data);
        post_req.end();
   }
}

db.userDB = "users";
db.forumDB = "forums";
db.lobbyDB = "lobbies";
db.postDB = "posts";
db.profileDB = "profiles";
db.threadDB = "threads";

db.user = function(username, callback) {
    db.query("SELECT * FROM users WHERE username=$1 ORDER BY username, email_account", [username], function(err, result) {
        callback(result[0]);
    });
}

db.userId = function(user_id) {
    db.query("SELECT * FROM users WHERE user_id=$1 ORDER BY username, email_account", [user_id], function(err, result) {
        callback(result[0]);
    });
}

db.addUser = function(username, email, password) {
    console.log("Calling db.addUser(" + username + "," + email + "," + password + ")");
    var conString = "pg://postgres:vowb-secure@localhost:5432/vowbnet";
    var client = new pg.Client(conString);
    client.connect(); 
    console.log("here!!");
    // Creat table and insert 2 records into it
    console.log("Inserting : " + JSON.stringify([username, email, password]));
    var qq = client.query("INSERT INTO users(username, email_account, password_hash) values($1, $2, $3)", [username, email, password]);
    console.log(qq);
}

/*
 * For security's sake, only call it when we know we're logged
 * in as "user".
 */
db.addFriend = function(user,friend) {
    db.search(db.userDB, {username: user}, function(user_result) {
        if( user_result.length > 0 ) {
            db.search(db.profileDB, { profile_id: user_result[0].profile_pointer }, function(profile_result) {
                if( profile_result.length == 0 ) {
                    db.addProfile({
                        description: "Welcome to Vowb.net, "+user+"! Your profile got generated late.",
                        full_name: user,
                        friends: [ friend ]
                    }, function(pcresult) {
                        console.log("!! created profile with ID: " + JSON.stringify(pcresult));
                        db.update(db.userDB, { username: user.username }, { profile_pointer: pcresult[0].profile_id });
                    });
                    console.log("Did add friend, also made a profile because user did not have one.");
                    return true;
                } else {
                    if( profile_result[0].friends ) {
                        if( profile_result[0].friends.indexOf(friend) != -1 )  {
                            // friend already added
                            console.log("Did not add friend because friend is already on list.");
                            return false;
                        } else {
                            db.update(db.profileDB, { profile_id: profile_result[0].profile_id }, {
                                friends: profile_result[0].friends.push(friend)
                            });
                            console.log("Did add friend, there was already friends on the list.");
                            return true;
                        }
                    } else {
                            db.update(db.profileDB, { profile_id: profile_result[0].profile_id }, {
                                friends: [ friend ]
                            });
                            console.log("Did add friend, there were not already friends on the list.");
                            return true;
                    }
                }
            });
        } else {
            console.log("Did not add friend, user not found.");
            return false;
        }
    });
}

db.hashPassword = function(string) {
    return sha1(string);//"DUMMY_HASH!!"+string+"!!DUMMY_HASH";
}

/*
 *  Generic "db.add" function.
 *  Vulnerable to SQL injection via the tablename
 *  and data property name variables, so don't call
 *  it on tablenames or property names that
 *  aren't guaranteed to be correct!
 *
 *  Example call:
 *
 *  db.add(db.userDB, {
 *      username: "etheller",
 *      email_account: "etheller@purdue.edu",
 *      password_hash: "hfo8q374r2yu3fifaehf437r234ur3iff"
 *  });
 *
 */
db.add = function(tablename, data, onCreate) {
    /*console.log("dummy table (before): " + JSON.stringify(DUMMY_DATABASE[tablename]));
    if( !DUMMY_DATABASE[tablename] )
        DUMMY_DATABASE[tablename] = [];
    console.log("dummy table thinking...");
    DUMMY_DATABASE[tablename].push(data);
    console.log("dummy table (after): " + JSON.stringify(DUMMY_DATABASE[tablename]));
    return;*/
    var queryString = "INSERT INTO "+tablename+"(";
    var i = 0;
    var itemIndex = 1;
    var values = [];//tablename];
    for (var column in data) {
        if (data.hasOwnProperty(column)) {
            if( i > 0 )
                queryString += ", ";
            //queryString += "$" + (itemIndex++);
            //values.push(column);
            queryString += column;
            i++;
        }
    }
    queryString += ") values(";
    i = 0;
    for (var column in data) {
        if (data.hasOwnProperty(column)) {
            if( i > 0 )
                queryString += ", ";
            queryString += "$" + (itemIndex++);
            values.push(data[column]);
            i++;
        }
    }
    queryString += ")";
    //console.log("search: " + queryString);
    db.query(queryString, values, function(err, result) {
        if( err ) {
            //console.log("Database .add ERROR: " + err.toString());
            throw err;
        } else {
            //console.log("Database .add: No error");
            if( onCreate )
                onCreate(result);
        }
    });
}

db.addProfile = function( data, onCreate ) {
    //profiles_profile_id_seq
    var queryString = "INSERT INTO "+db.profileDB+"(";
    var i = 0;
    var itemIndex = 1;
    var values = [];//tablename];
    for (var column in data) {
        if (data.hasOwnProperty(column)) {
            if( i > 0 )
                queryString += ", ";
            //queryString += "$" + (itemIndex++);
            //values.push(column);
            queryString += column;
            i++;
        }
    }
    queryString += ") values(";
    i = 0;
    for (var column in data) {
        if (data.hasOwnProperty(column)) {
            if( i > 0 )
                queryString += ", ";
            queryString += "$" + (itemIndex++);
            values.push(data[column]);
            i++;
        }
    }
    queryString += ")";
    queryString += " RETURNING profile_id;";
    //console.log("search: " + queryString);
    db.query(queryString, values, function(err, result) {
        if( err ) {
            //console.log("Database .add ERROR: " + err.toString());
            throw err;
        } else {
            //console.log("Database .add: No error");
            if( onCreate )
                onCreate(result);
        }
    });
}

/*
 *  Another generic database usage function.
 *  Vulnerable to SQL injection via the tablename
 *  variable, so don't call it on tablenames that
 *  aren't from something like "db.userDB"!
 *  Also searchParams property names are vulnerable
 *  as well.
 * 
 *  Example call:
 *
 *  db.search(db.userDB, { username: "etheller" }, function(results) {
 *      for(i = 0; i < results.length; i++ ) {
 *          console.log(results[i].email_account);
 *      }
 *  });
 *
 *  This code would print out the email address of all users named "etheller"
 *
 */
db.search = function(tablename, searchParams, callback) {
    /*if( !DUMMY_DATABASE[tablename] )
        DUMMY_DATABASE[tablename] = [];
    var dummyResults = [];
    for(var i = 0; i < DUMMY_DATABASE[tablename].length; i++ ) {
        var match = true;
        for (var column in searchParams) {
            if (searchParams.hasOwnProperty(column)) {
                if( DUMMY_DATABASE[tablename][i][column] != searchParams[column] ) {
                    match = false;
                }
            }
        }
        if( match )
            dummyResults.push(DUMMY_DATABASE[tablename][i]);
    }
    console.log("dummy results: " + JSON.stringify(dummyResults));
    callback(dummyResults);
    return;*/
    var queryString = "SELECT * FROM "+tablename+" WHERE ";
    var i = 0;
    var itemIndex = 1;
    var values = [];//tablename];
    for (var column in searchParams) {
        if (searchParams.hasOwnProperty(column)) {
            if( i > 0 )
                queryString += " AND ";
            queryString += column + "=$" + (itemIndex++);
            values.push(searchParams[column]);
            i++;
        }
    }
    //console.log("search: " + queryString);
    db.query(queryString, values, function(err, result) {
        if( err ) {
            //console.log("Database .search ERROR: " + err.toString());
            throw err;
        } else {
            //console.log("Database .search: No error");
            callback(result);
        }
    });
}


/*
 *  Another generic database usage function.
 *  Vulnerable to SQL injection via the tablename
 *  and data property name variables, so don't call
 *  it on tablenames or property names that
 *  aren't guaranteed to be correct!
 * 
 *  Example call:
 *
 *  db.update(db.userDB, { username: "etheller" }, {
 *      signature: "My signature just got 2x cooler."
 *  });
 *
 *  This code would update the signature for user "etheller"
 *  to the phrase shown above.
 *
 */
db.update = function(tablename, searchParams, data, onUpdate) {
    
    /*if( !DUMMY_DATABASE[tablename] )
        DUMMY_DATABASE[tablename] = [];
    for(var i = 0; i < DUMMY_DATABASE[tablename].length; i++ ) {
        var match = true;
        for (var column in searchParams) {
            if (searchParams.hasOwnProperty(column)) {
                if( DUMMY_DATABASE[tablename][i][column] != searchParams[column] ) {
                    match = false;
                }
            }
        }
        if( match ) {
            for (var column in data) {
                if (data.hasOwnProperty(column)) {
                    DUMMY_DATABASE[tablename][i][column] = data[column];
                }
            }
        }
    }
    return;*/
    var queryString = "UPDATE "+tablename+" SET ";
    var i = 0;
    var itemIndex = 1;
    var values = [];
    for (var column in data) {
        if (data.hasOwnProperty(column)) {
            if( i > 0 )
                queryString += ", ";
            queryString += "\"" + column + "\"=$" + (itemIndex++);
            values.push(data[column]);
            i++;
        }
    }
    queryString += " WHERE "
    i = 0;
    for (var column in searchParams) {
        if (searchParams.hasOwnProperty(column)) {
            if( i > 0 )
                queryString += " AND ";
            queryString += "\"" + column + "\"=$" + (itemIndex++);
            values.push(searchParams[column]);
            i++;
        }
    }
    queryString += ";";
    //console.log("update: " + queryString +"; " + JSON.stringify(values));
    db.query(queryString, values, function(err, result) {
        if( err ) {
            //console.log("Database .update ERROR: " + err.toString());
            throw err;
        } else {
            //console.log("Database .update: No error");
            if( onUpdate )
                onUpdate(result);
        }
    });
}