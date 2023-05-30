const connection = require('../../database')

exports.create_user = (req, res, next) => {
    var post = {
       username : req.body.username,
       password: req.body.password,
       access_level : 1,
       account_id : req.body.account_id,
       created_by : req.body.created_by
    }

    const sql = "INSERT INTO users SET ?";
    var query = connection.query(
        sql, post, function(error, results, fields){
            if(error) throw error;
            res.json(results);
        }
    );
}

exports.get_all_user = (req, res, next) => {
    const sql = "SELECT * FROM users ORDER BY id DESC ";
    connection.query(
      sql, function(error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    ); 
} 

exports.is_user_valid = (req, res, next) => {
    var user = {
        username : req.body.username,
        password: req.body.password,
    }
    var values = [user.username, user.password]

    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    connection.query(
      sql, values, function(error, results, fields) {
        if (error) throw error;
        if(results.length === 0){
            res.json('No User')
        }else{ 
            res.json(results);
        }
      }
    ); 
}

exports.get_user_by_page = (req, res, next) => {
    const page = parseInt(req.params.offset);
    let offset = (page - 1) * 200;
    const values = [200, offset];
    const sql = "SELECT * FROM users LIMIT ? OFFSET ? ORDER BY id DESC ";
    connection.query(
      sql, values, function(error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    ); 
}

