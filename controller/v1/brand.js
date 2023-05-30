const connection = require('../../database');
const util = require('util');

const query = util.promisify(connection.query).bind(connection);
const AppError = require('../../utils/appError');

exports.create_brand = async(req, res, next) => {

    var post = {
      account_id : req.body.account_id,
      name : req.body.brand_name,
      user_id : req.body.user_id,
      is_deleted : req.body.is_deleted,
    }

    values = [post.account_id, post.name]

    try{
      const results1 = await query(`SELECT * FROM brand WHERE account_id = ? 
      AND is_deleted = 0 AND name = ?`, values);
      
      if(results1.length){
        const appError = new AppError('brand already exist', 500, 'create brand', post.account_id)
        appError.logError()
        throw appError
      }else{
          try{
            const results2 = await query('INSERT INTO brand SET ?', post)
            res.json(results2)
          }catch(err){
            const appError = new AppError(err.message, err.status, 'create brand', post.account_id)
            appError.logError()
            throw appError
          }
      }
    }catch(err){
      next(err)
    }

}

exports.get_all_brand = (req, res, next) => {
    const sql = "SELECT * FROM brand WHERE account_id = ? AND is_deleted = 0 ORDER BY id DESC ";
    connection.query(
      sql, req.params.account_id, function(error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    ); 
}

exports.get_brand_by_id = (req, res, next) => {
  id = parseInt(req.params.id)
  const sql = "SELECT * FROM brand WHERE id = ?";
  connection.query(
    sql, id, function(error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  ); 
}

exports.get_brand_by_page = (req, res, next) => {
    const page = parseInt(req.params.offset);
    let offset = (page - 1) * 200;
    const values = [200, offset];
    const sql = "SELECT * FROM brand LIMIT ? OFFSET ? ORDER BY id DESC ";
    connection.query(
      sql, values, function(error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    );
}

exports.update_brand = async(req, res, next) => {
  const brandId = parseInt(req.params.id)

  try{
    values = [req.body.account_id, req.body.name]
    const results1 = await query(`SELECT * FROM brand WHERE account_id = ? 
    AND is_deleted = 0 AND name = ?`, values);
    
    if(results1.length){
      const appError = new AppError('brand already exist', 500, 'update brand', req.body.account_id)
      appError.logError()
      throw appError
    }else{
        try{
          data2 = [req.body.name, req.body.user_id, brandId, req.body.account_id]
          const results2 = await query(`UPDATE brand SET name = ?, user_id = ? WHERE id = ? AND account_id = ?`, data2);
          res.json(results2)
        }catch(err){
          const appError = new AppError(err.message, err.status, 'update brand', req.body.account_id)
          appError.logError()
          throw appError
        }
    }
  }catch(err){
    next(err)
  }
}

exports.delete_brand = (req, res, next) => {
  values = [req.params.id, req.params.account_id] 
  const sql = "UPDATE brand SET is_deleted = 1 WHERE id = ? AND account_id = ?";
  connection.query(
    sql, values, function(error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  ); 
}

