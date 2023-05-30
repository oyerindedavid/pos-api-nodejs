const connection = require('../../database')

exports.create_location_area = (req, res, next) => {
    var post = {
       account_id : req.body.account_id,
       name : req.body.name,
       long_name : req.body.long_name,
       phone: req.body.phone,
       email : req.body.email,
       address : req.body.address,
       phone : req.body.phone,
       user_id : req.body.user_id
    }

    const sql = "INSERT INTO location_area SET ?";
    var query = connection.query(
        sql, post, function(error, results, fields){
            if(error) throw error;
            res.json(results);
        }
    );
}

exports.get_location_areas_by_account_id = (req, res, next) => {
    const sql = "SELECT * FROM location_area WHERE account_id = ? ";
    connection.query(
    sql, req.params.account_id, function(error, results, fields) {
          if (error) throw error;
          res.json(results);
        }
    ); 
}

exports.getA_location_areas_by_account_id = (req, res, next) => {
    let data = [req.params.account_id, req.params.id]
    const sql = "SELECT * FROM location_area WHERE account_id = ? AND id = ? ";
    connection.query(
    sql, data, function(error, results, fields) {
          if (error) throw error;
          res.json(results[0]);
        }
    ); 
}
