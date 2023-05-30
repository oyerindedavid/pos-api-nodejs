const connection = require('../../database')

exports.create_module = (req, res, next) => {
    var post = {
       user_id    : req.body.user_id,
       name       : req.body.name,
       developer_id : req.body.developer_id,
       is_free : req.body.is_free,
       monthly_cost : req.body.monthly_cost
    }

    const sql = "INSERT INTO modules SET ?";
    var query = connection.query(
        sql, post, function(error, results, fields){
            if(error) throw error;
            res.json(results);
        }
    );
}

exports.get_all_modules = (req, res, next) => {
    
    const sql = "SELECT * FROM modules";
    var query = connection.query(
        sql, function(error, results, fields){
            if(error) throw error;
            res.json(results);
        }
    );
}

exports.get_a_module = (req, res, next) => {
    
    const sql = "SELECT * FROM modules WHERE id = ?";
    var query = connection.query(
        sql, req.params.id, function(error, results, fields){
            if(error) throw error;
            res.json(results);
        }
    );
}

exports.add_module_to_account = (req, res, next) => {
    var post = {
       account_id : req.body.account_id,
       user_id    : req.body.user_id,
       module_id  : req.body.module_id,
       is_active  : req.body.is_active,
       last_renewal_date : req.body.last_renewal_date,
       next_renewal_date : req.body.next_renewal_date
    }

    const sql = "INSERT INTO module_user SET ?";
    var query = connection.query(
        sql, post, function(error, results, fields){
            if(error) throw error;
            res.json(results);
        }
    );
}

exports.update_module_status = (req, res, next) => {
    var post = {
       account_id : req.body.account_id,
       user_id: req.body.user_id,
       module_id : req.body.module_id,
       is_active : req.body.is_active,
    }

    const sql = "INSERT INTO module_user SET ?";
    var query = connection.query(
        sql, post, function(error, results, fields){
            if(error) throw error;
            res.json(results);
        }
    );
}

exports.update_module_renewal_date = (req, res, next) => {
    var post = {
       account_id : req.body.account_id,
       user_id: req.body.user_id,
       module_id : req.body.module_id,
       last_renewal_date : req.body.last_renewal_date,
       next_renewal_date : req.body.next_renewal_date
    }

    const sql = "INSERT INTO module SET ?";
    var query = connection.query(
        sql, post, function(error, results, fields){
            if(error) throw error;
            res.json(results);
        }
    );
}



