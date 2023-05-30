const connection = require('../../database')

exports.create_staff = (req, res, next) => {
    var post = {
       username : req.body.username,
       password: req.body.password
    }

    const sql = "INSERT INTO staffs SET ?";
    var query = connection.query(
        sql, post, function(error, results, fields){
            if(error) throw error;
            res.json(results);
        }
    );
}

exports.get_all_staff = (req, res, next) => {
    const sql = "SELECT * FROM staffs WHERE account_id = ? ORDER BY id DESC ";
    connection.query(
      sql, req.params.account_id, function(error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    ); 
} 

exports.is_staff_valid = (req, res, next) => {
    var user = {
        username : req.body.username,
        password: req.body.password,
    }
    var values = [user.username, user.password]

    const sql = "SELECT * FROM staffs WHERE username = ? AND password = ?";
    connection.query(
      sql, values, function(error, results, fields) {
        if (error) throw error;
        if(results.length === 0){
            res.json('No Staff')
        }else{ 
            res.json(results);
        }
      }
    ); 
}

exports.get_staff_by_page = (req, res, next) => {
    const page = parseInt(req.params.offset);
    let offset = (page - 1) * 200;
    const values = [200, offset];
    const sql = "SELECT * FROM staffs LIMIT ? OFFSET ? ORDER BY id DESC ";
    connection.query(
      sql, values, function(error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    ); 
}

