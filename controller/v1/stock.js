const connection = require('../../database')
const util = require('util');

const query = util.promisify(connection.query).bind(connection);

exports.stock_take = (req, res, next) =>{
    var post = {
        stocks : req.body.stocks,
        account_id : req.body.accountId,
        location_area_id : req.body.locationAreaId,
        batch_code : batchCode(10000000,100000000000000),
        user_id :  req.body.userId,
    }

    //Function for generating stock batch
    function batchCode(min, max){
      return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    post.stocks.forEach(stock => {
        var stockData = {
            product_id :   stock.productId,
            account_id : req.body.accountId,
            location_area_id : req.body.locationAreaId,
            reason_id : req.body.reasonId,
            current_stock :  stock.currentStock,
            stock_qty :  stock.newStock,
            batch_code : post.batch_code,
            user_id : req.body.userId
        }
        let newStock = parseInt(stock.newStock);

    connection.beginTransaction(function(err) {
        if (err) { throw err; }
        stockRec = [newStock, stock.productId, req.body.locationAreaId, req.body.accountId]
        connection.query('UPDATE stock SET current_stock = ? WHERE product_id = ? AND location_area_id = ? AND account_id = ?', stockRec, function (error, results, fields) {
          if (error) {
            return connection.rollback(function() {
              throw error;
            });
          }

          var log = 'Stock ' + results.insertId + ' added';

          connection.query("INSERT INTO stock_history SET ?", stockData, function (error, results, fields) {
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
       });
    });
}

exports.get_a_stock_info = async(req, res, next) =>{
  try{
    values = [req.body.product_id, req.body.location_area_id, req.body.account_id]
    result = await query("SELECT * FROM stock WHERE product_id = ? AND location_area_id = ? AND account_id = ? ", values)
  
    res.json(result)
  }catch(err){
    console.log(err)
  }
  
}

