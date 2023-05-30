const connection = require('../../database')
const util = require('util');

const query = util.promisify(connection.query).bind(connection);

exports.submitBasket = (req, res, next) => {
  let customer_id;

    if(req.body.customer == null){
       customer_id = 0;
    }

    var basket = {
       customer_id : customer_id,
       staff_id : req.body.staff.id,
       is_completed: req.body.is_completed,
       discount_id : req.body.discount_id,
       discount_type : req.body.discount_type,
       discount_worth : req.body.discount_worth,
       sub_total : req.body.sub_total,
       total_inc_tax:  req.body.total_inc_tax,
       total_exl_tax:   req.body.total_exl_tax,
       device_id : req.body.device_id,
       account_id : req.body.account_id,
       date : req.body.date
    }

    connection.beginTransaction(function(err){
        if (err) { throw err; }
        connection.query('INSERT INTO basket SET ?', basket, function (error, results, fields) {
          if (error) {
            return connection.rollback(function() {
              throw error;
            }); 
          }

          var log = 'Post ' + results.insertId + ' added';

          var basketItems =  req.body.basketItems;
          
          basketItems.forEach(basketItem => {
            
              var basketItem = {
                    product_id : basketItem.product.id,
                    cost_price : basketItem.product.cost_price,
                    selling_price : basketItem.product.selling_price,
                    basket_id : results.insertId,
                    qty: basketItem.qty,
                    discount_id: basketItem.discount_id,
                    discount_worth: basketItem.discount_worth,
                    discount_type: basketItem.discount_type,
                    note: basketItem.note,
                    sub_total : basketItem.sub_total,
                    total_inc_tax:  basketItem.total_inc_tax,
                    total_exl_tax:  basketItem.total_exl_tax,
                    staff_id : req.body.staff.id,
                    is_completed: req.body.is_completed,
                    device_id : req.body.device_id,
                    account_id : req.body.account_id,
                    date_created: basketItem.date
              }
                
                
          //Get the location_area_id of the item to update
          deviceQueryVal = [req.body.account_id, req.body.device_id]
            
          let queryStock = "SELECT * FROM device WHERE account_id = ? and id = ?"
          connection.query(
              queryStock, deviceQueryVal, function(error, results, fields) {
                if (error) throw error;
                
                let locationAreaId = results[0].location_area_id
                
                //Get the stock record of item to update
            values = [basket.account_id, basketItem.product_id, locationAreaId]
             
            let queryStock = "SELECT * FROM stock WHERE account_id = ? AND product_id = ? AND location_area_id = ?"
            connection.query(
              queryStock, values, function(error, results, fields) {
                if (error) throw error;
                
                let currentStock = results[0].current_stock 
                let newStock = currentStock - basketItem.qty
                
                // Update the stock record of the item at the specified location
                stockRec = [parseInt(newStock), basketItem.product_id, locationAreaId, req.body.account_id]
                
                connection.query('UPDATE stock SET current_stock = ? WHERE product_id = ? AND location_area_id = ? AND account_id = ?', stockRec, function (error, results, fields) {
                  if (error) {
                    return connection.rollback(function() {
                      throw error;
                    });
                  }
                  console.log('success updating stock record');
                });
              });
            });

            connection.query('INSERT INTO basket_items SET ?', basketItem, function (error, results, fields) {
                if(error){
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
                  console.log('success saving basket items');
                });
              });
          });
       });
    });
    res.json({status: 'success'})
}


exports.heldTransactions = async(req, res, next) => {
  heldTrans = []
  account_id = parseInt(req.params.account_id)
  
  try{
    results = await query(`SELECT s.username, b.staff_id
       FROM basket AS b
       LEFT JOIN staffs AS s
       ON b.staff_id = s.id
       WHERE is_completed = 0 AND b.account_id = ? 
       GROUP BY b.staff_id ORDER BY b.id ASC`, account_id) 

    for(var i = 0; i < results.length; i++){
      data = [results[i]['staff_id'], account_id]
      try{
        //Getting the baskets that belongs to the staff
        results2 = await query("SELECT * FROM basket WHERE staff_id = ? AND account_id = ? AND is_completed = 0 ORDER BY id DESC", data)
        results[i]['baskets'] = results2
         
        try{
          for(var x = 0; x < results2.length; x++){
            results3 = await query(`SELECT * FROM basket_items WHERE basket_id = ? `, results2[x]['id'])
            results2[x]['basketItems'] = results3

            for(var y = 0; y < results3.length; y++){
              results4 = await query(`SELECT * FROM product WHERE id = ? `, results3[y]['product_id'])
              results3[y]['product'] = results4[0]
            }
            
          }
        }catch(err){
          console.log(err)
        }
      }catch(err){
        console.log(err)
      }
    }
    res.json(results)
  }catch(err){
    console.log(err)
  }
   
}

exports.deleteHeldTransaction = (req, res, next)=>{
    
  connection.beginTransaction(function(err) {
    if (err) { throw err; }
    var values = [req.params.account_id, req.params.basket_id]
    connection.query('DELETE FROM basket WHERE account_id = ? AND id = ?', values, function (error, results, fields) {
      if (error) {
        return connection.rollback(function() {
          throw error;
        });
      }
   
      connection.query('DELETE FROM basket_items WHERE account_id = ? AND basket_id = ?', values, function (error, results, fields) {
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
          res.json({status: 'success'})
        });
      });
    });
  })
  
}
