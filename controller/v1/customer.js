const connection = require('../../database')

exports.create_customer = (req, res, next) => {
    var post = {
       firstname : req.body.firstname,
       lastname: req.body.lastname,
       phone: req.body.phone,
       address : req.body.address,
       email : req.body.email,
       user_id : req.body.user_id,
    }

    const sql = "INSERT INTO customer SET ?";
    var query = connection.query(
        sql, post, function(error, results, fields){
            if(error) throw error;
            res.json(results);
        }
    );
}

exports.get_all_customer = (req, res, next) => {
    const sql = "SELECT * FROM customer ORDER BY id DESC ";
    connection.query(
      sql, function(error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    ); 
} 

exports.get_customer_by_id = (req, res, next) => {
    const sql = "SELECT * FROM customer WHERE id = ? ";
    connection.query(
    sql, req.params.id, function(error, results, fields) {
          if (error) throw error;
          res.json(results);
        }
    ); 
  }

exports.get_customer_by_page = (req, res, next) => {
    const page = parseInt(req.params.offset);
    let offset = (page - 1) * 200;
    const values = [200, offset];
    const sql = "SELECT * FROM customer LIMIT ? OFFSET ? ORDER BY id DESC ";
    connection.query(
      sql, values, function(error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    ); 
}

