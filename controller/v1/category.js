const connection = require('../../database');
const util = require('util');

const query = util.promisify(connection.query).bind(connection);
const AppError = require('../../utils/appError');

exports.create_category = async(req, res, next) => {

    var post = {
       account_id : req.body.account_id,
       name : req.body.category_name,
       user_id : req.body.user_id,
       is_deleted : req.body.is_deleted,
    }

    values = [post.account_id, post.name]

    try{
      const results1 = await query(`SELECT * FROM category WHERE account_id = ? 
      AND is_deleted = 0 AND name = ?`, values);
      
      if(results1.length){
        const appError = new AppError('Category already exist', 500, 'create category', post.account_id)
        appError.logError()
        throw appError
      }else{
          try{
            const results2 = await query('INSERT INTO category SET ?', post)
            res.json(results2)
          }catch(err){
            const appError = new AppError(err.message, err.status, 'create category', post.account_id)
            appError.logError()
            throw appError
          }
      }
    }catch(err){
      next(err)
    }

}

exports.get_all_category = (req, res, next) => {
    const sql = "SELECT * FROM category WHERE account_id = ? AND is_deleted = 0 ORDER BY id DESC ";
    connection.query(
      sql, req.params.account_id, function(error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    ); 
}

exports.get_category_by_id = (req, res, next) => {
  id = parseInt(req.params.id)
  const sql = "SELECT * FROM category WHERE id = ?";
  connection.query(
    sql, id, function(error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  ); 
}

exports.get_category_by_page = (req, res, next) => {
    const page = parseInt(req.params.offset);
    let offset = (page - 1) * 200;
    const values = [200, offset];
    const sql = "SELECT * FROM category LIMIT ? OFFSET ? ORDER BY id DESC ";
    connection.query(
      sql, values, function(error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    );
}

exports.update_category = async(req, res, next) => {
  const categoryId = parseInt(req.params.id)

  try{
    values = [req.body.account_id, req.body.name]
    const results1 = await query(`SELECT * FROM category WHERE account_id = ? 
    AND is_deleted = 0 AND name = ?`, values);
    
    if(results1.length){
      const appError = new AppError('Category already exist', 500, 'update category', req.body.account_id)
      appError.logError()
      throw appError
    }else{
        try{
          data2 = [req.body.name, req.body.user_id, categoryId, req.body.account_id]
          const results2 = await query(`UPDATE category SET name = ?, user_id = ? WHERE id = ? AND account_id = ?`, data2);
          res.json(results2)
        }catch(err){
          const appError = new AppError(err.message, err.status, 'update category', req.body.account_id)
          appError.logError()
          throw appError
        }
    }
  }catch(err){
    next(err)
  }
}

exports.delete_category = (req, res, next) => {
  values = [req.params.id, req.params.account_id] 
  const sql = "UPDATE category SET is_deleted = 1 WHERE id = ? AND account_id = ?";
  connection.query(
    sql, values, function(error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  ); 
}

