const connection = require('../../database')

exports.create_product = (req, res, next) => {
    var post = {
       account_id : req.body.account_id,
       name : req.body.name,
       description : req.body.description,
       cost_price : req.body.cost_price,
       selling_price : req.body.selling_price,
       image : req.body.image,
       category_id : parseInt(req.body.category_id) ,
       barcode : req.body.barcode,
       popup_note_id: req.body.popup_note_id,
       supplier_id : parseInt(req.body.supplier_id),
       is_variable_price : req.body.is_variable_price,
       colour_id: parseInt(req.body.colour_id),
       brand_id: req.body.brand_id,
       tax: req.body.tax,
       is_deleted : req.body.is_deleted,
       tag_id: parseInt(req.body.tag_id),
       visibility: req.body.visibility,
       user_id: req.body.user_id
    }

    
    connection.beginTransaction(function(err) {
      if (err) { throw err; }
     
      //Create product record
      connection.query('INSERT INTO product SET ?', post, function (error, results, fields) {
        if (error){
          return connection.rollback(function() {
            throw error;
          });
        }

        var log = 'Product ' + results.insertId + ' added';
        
        const sql = "SELECT * FROM location_area WHERE account_id = ? ";
        connection.query(
        sql, req.body.account_id, function(error, res2, fields) {
              if (error) throw error;
              res2.forEach(result => {
                var stockData = {
                  product_id :   results.insertId,
                  account_id : req.body.account_id,
                  location_area_id : result.id,
                  user_id : req.body.user_id,
                }
                //Create stock record for each location
                connection.query("INSERT INTO stock SET ?", stockData, function (error, res3, fields) {
                  if (error) {
                    return connection.rollback(function() {
                      throw error;
                    });
                  }
                  connection.commit(function(err) {
                    if (err) {
                      return connection.rollback(function() {
                        throw err;
                      });
                    }
                    console.log('success!');
                    
                  });
                });
              });
            }
        );

        res.json(results)
        });
     }); 
}

exports.get_product_by_id = (req, res, next) => {
  const id = parseInt(req.params.id);
  const sql = "SELECT * FROM product WHERE id = ?";
  connection.query(
    sql, id, function(error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  ); 
}

exports.get_all_product = (req, res, next) => {
    const sql = "SELECT * FROM product WHERE visibility = 1 AND is_deleted = 0 ORDER BY id DESC ";
    connection.query(
      sql, function(error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    ); 
}

exports.search_product = (req, res, next) => {
  let keyword = req.params.keyword;
  const sql = 'SELECT * FROM product WHERE visibility = 1 AND is_deleted = 0 AND name LIKE ?';
  connection.query(
    sql, '%' + keyword + '%', function(error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  ); 
}

exports.get_product_by_page = (req, res, next) => {
    const page = parseInt(req.params.offset);
    let   offset = (page - 1) * 200;
    const values = [200, offset];
    const sql = "SELECT * FROM product WHERE visibility = 1 AND is_deleted = 0 LIMIT ? OFFSET ? ORDER BY id DESC ";
    connection.query(
      sql, values, function(error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    ); 
}

exports.update_product = (req, res, next) => {
  const productId = parseInt(req.params.id)
  values = [req.body.name, req.body.description, req.body.cost_price, req.body.selling_price,
            req.body.category_id, req.body.barcode, req.body.supplier_id, req.body.is_variable_price,
            req.body.brand_id, req.body.tax, req.body.tag_id, req.body.visibility, productId, req.body.account_id      
           ]
  const sql = `UPDATE product SET name = ?, description = ?, cost_price = ?, selling_price = ?,
      category_id = ?, barcode = ?, supplier_id = ?, is_variable_price = ?, brand_id = ?, 
      tax = ?, tag_id = ?, visibility = ?
      WHERE id = ? AND account_id = ?`
  connection.query(
    sql, values, function(error, results, fields){
      if(error) throw error;
      res.json(results) 
    }
  )
}

exports.delete_product = (req, res, next) => {
  values = [req.params.id, req.params.account_id] 
  const sql = "UPDATE product SET is_deleted = 1 WHERE id = ? AND account_id = ?";
  connection.query(
    sql, values, function(error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  ); 
}

