const connection = require('../../database')
const util = require('util');

const query = util.promisify(connection.query).bind(connection);
const AppError = require('../../utils/appError');

exports.create_supplier = async(req, res, next) => {
    var post = {
       account_id : req.body.account_id,
       name : req.body.supplier_name,
       email : req.body.email,
       address: req.body.address,
       phone: req.body.phone,
       user_id : req.body.user_id,
       is_deleted : req.body.is_deleted
    }

    try{
      var values = [req.body.account_id, req.body.supplier_name]
      const results1 = await query(`SELECT * FROM supplier WHERE account_id = ? 
      AND is_deleted = 0 AND name = ?`, values);
      
      if(results1.length){
        const appError = new AppError('supplier already exist', 500, 'create supplier', post.account_id)
        appError.logError()
        throw appError
      }else{
          try{
            const results2 = await query('INSERT INTO supplier SET ?', post)
            res.json(results2)
          }catch(err){
            const appError = new AppError(err.message, err.status, 'create supplier', post.account_id)
            appError.logError()
            throw appError
          }
      }
    }catch(err){
      next(err)
    }
}

exports.get_all_supplier = (req, res, next) => {
    const sql = `SELECT * FROM supplier WHERE account_id = ? AND is_deleted = 0 
                  ORDER BY id DESC `;
    connection.query(
      sql, req.params.account_id, function(error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    ); 
}

exports.get_supplier_by_id = (req, res, next) => {
  id = parseInt(req.params.id)
  const sql = "SELECT * FROM supplier WHERE id = ?";
  connection.query(
    sql, id, function(error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  ); 
}

exports.get_supplier_by_page = (req, res, next) => {
    const page = parseInt(req.params.offset);
    let offset = (page - 1) * 200;
    const values = [200, offset];
    const sql = "SELECT * FROM supplier LIMIT ? OFFSET ? ORDER BY id DESC ";
    connection.query(
      sql, values, function(error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    ); 
}


exports.update_supplier = async(req, res, next) => {
  const supplierId = parseInt(req.params.id)
  
  try{
    values = [req.body.account_id, req.body.name]
    const results1 = await query(`SELECT * FROM supplier WHERE account_id = ? 
    AND is_deleted = 0 AND name = ?`, values);
    
    if(results1.length){
      try{
        data1 = [req.body.email, req.body.address, req.body.phone, req.body.user_id, supplierId, req.body.account_id ]
        const sql = `UPDATE supplier SET email = ?,
             address = ?, phone = ?, user_id = ? 
             WHERE id = ? AND account_id = ?`
        const results2 = await query(sql, data1);
        res.json(results2)
      }catch(err){
        const appError = new AppError(err.message, err.status, 'update existing supplier', req.body.account_id)
        appError.logError()
        throw appError
      }
    }else{
        try{
          data2 = [req.body.name, req.body.email, req.body.address, req.body.phone, req.body.user_id, supplierId, req.body.account_id ]
          const sql = `UPDATE supplier SET name = ?, email = ?,
               address = ?, phone = ?, user_id = ? 
               WHERE id = ? AND account_id = ?`
          const results2 = await query(sql, data2);
          res.json(results2)
        }catch(err){
          const appError = new AppError(err.message, err.status, 'update supplier', req.body.account_id)
          appError.logError()
          throw appError
        }
    }
  }catch(err){
    next(err)
  }

}

exports.delete_supplier = (req, res, next) => {
  values = [req.params.id, req.params.account_id] 
  const sql = "UPDATE supplier SET is_deleted = 1 WHERE id = ? AND account_id = ?";
  connection.query(
    sql, values, function(error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  ); 
}
