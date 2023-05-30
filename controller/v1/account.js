const connection = require('../../database')

exports.create_account = (req, res, next) => {
    var post = {
       name : req.body.name,
       phone: req.body.phone,
       address : req.body.address,
       email : req.body.email,
       is_location_price : req.body.is_location_price,
       is_api : req.body.is_api
    }
    console.log('Create account')

    const sql = "INSERT INTO account SET ?";
    var query = connection.query(
        sql, post, function(error, results, fields){
            if(error) throw error;
            res.json(results);
        }
    );
}

exports.get_all_account = (req, res, next) => {
    const sql = "SELECT * FROM account ORDER BY id DESC ";
    connection.query(
      sql, function(error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    ); 
} 

exports.get_account_by_id = (req, res, next) => {
    const sql = "SELECT * FROM account WHERE id = ? ";
    connection.query(
    sql, req.params.id, function(error, results, fields) {
          if (error) throw error;
          res.json(results);
        }
    ); 
  }

exports.get_account_by_page = (req, res, next) => {
    const page = parseInt(req.params.offset);
    let offset = (page - 1) * 200;
    const values = [200, offset];
    const sql = "SELECT * FROM account LIMIT ? OFFSET ? ORDER BY id DESC ";
    connection.query(
      sql, values, function(error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    ); 
}

