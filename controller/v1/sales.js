const connection = require('../../database')
const date = require('date-and-time');
const util = require('util');

const query = util.promisify(connection.query).bind(connection);

exports.get_sales = async(req, res, next) => {
    let sales = [];
    var post = {
      dateAction : req.body.dateAction,
      start_date : req.body.start_date,
      end_date : req.body.end_date,
      location_area_id : req.body.location_area_id,
      devices : req.body.devices,
      device_group_id : req.body.device_group_id,
      staff_id : req.body.staff_id,
      query : req.body.query,
      account_id : req.body.account_id
    }
    
    try{
      let result;
      let values;
      let devices = [];
      
      if(post.query ==  1){
        post.devices.forEach(element =>{
          devices.push(element.id)
        })
        if(post.dateAction == "Range"){
          values = [post.start_date, post.end_date, post.staff_id, devices, post.account_id]
          result = await query(`SELECT id, SUM(sub_total), SUM(is_completed) AS completed_transactions, staff_id, date 
          FROM basket WHERE date BETWEEN ? AND ? AND staff_id IN (?) AND device_id IN (?) 
          AND account_id = ? AND is_completed = 1 GROUP BY date `, values);
        }/*  else{
          //Date action is today
          const now = new Date();
          let today = date.format(now, 'YYYY-MM-DD')
          let value = [post.staff_id, devices, post.account_id, today]
          result = await query(`SELECT id, SUM(total) AS total, staff_id, date 
          FROM basket WHERE staff_id IN (?) AND device_id IN (?) AND account_id = ? 
          AND is_completed = 1 AND date = ? GROUP BY date `, value);
        } */
      }else{
         let val = post.account_id
         result = await query(`SELECT id, SUM(sub_total), SUM(is_completed) AS completed_transaction, staff_id, date 
         FROM basket WHERE is_completed = 1 AND account_id = ? GROUP BY date `, val);
      }
      /* for(let i = 0; i < result.length; i++){
            const result2 =  await query("SELECT * FROM basket_items WHERE basket_id = ?", result[i].id)
            result[i]['basket_items'] = [];
            if(result2.length > 0){
              result2.forEach(async ress => {
                const result3 = await query("SELECT * FROM product WHERE id = ?", ress.product_id)
                //console.log(result3[0].name)
                ress['product_name'] = result3[0].name;
                ress['selling_price'] = result3[0].selling_price;
                result[i]['basket_items'].push(ress);
              })
            }else{
              sales.push(result2[0]);
            }     
          } */
      res.json(result);
    }catch(err){
       console.log(err)
    }
}
  
exports.get_sales_by_date = async(req, res, next) => {
    let sales = [];
    try{
        const result2 =  await query("SELECT id, product_id, cost_price, selling_price,SUM(discount_worth) AS  discount, SUM(qty) FROM basket_items WHERE date_created = ? GROUP BY product_id", req.params.date)
        if(result2.length > 0){
          for(var i = 0; i < result2.length; i++){
            const result3 = await query("SELECT * FROM product WHERE id = ?", result2[i].product_id)
            result2[i]['product_name'] = result3[0].name;
            result2[i]['margin'] = result2[i].selling_price - result2[i].cost_price;
            num = ((result2[i]['margin'] / result2[i].selling_price) * 100)
            result2[i]['percentage_margin'] = Math.round((num + Number.EPSILON) * 100) /100
            result2[i]['net_sale'] = (result2[i].selling_price * result2[i].qty) - result2[i].discount;
          }     
        
           res.json(result2);
        }else{
          res.json(sales);
        }
    }catch(err){
       console.log(err)
    }
}

exports.get_product_sales_by_date = async(req, res, next) => {
  let sales = [];
  try{
      const result2 =  await query("SELECT id, product_id, SUM(qty) FROM basket_items WHERE date = ? ", req.params.date)
      if(result2.length > 0){
        for(var i = 0; i < result2.length; i++){
          const result3 = await query("SELECT * FROM product WHERE id = ?", result2[i].product_id)
          result2[i]['product_name'] = result3[0].name;
          result2[i]['total'] = result3[0].selling_price * result2[i].qty;
        }     
      
         res.json(result2);
      }else{
        res.json(sales);
      }
  }catch(err){
     console.log(err)
  }
}

/* exports.get_sales_by_product = async(req, res, next) => {
    sales = [];
    

    var filter = {
      dateAction : req.body.dateAction,
      start_date : req.body.start_date,
      end_date : req.body.end_date,
      devices: req.body.devices,
      staff_id: req.body.staff_id,
      keyword: req.body.keyword,
      account_id : req.body.account_id
    }

    let devices = [];
    filter.devices.forEach(element =>{
      devices.push(element.id)
    })

    val = [
      filter.start_date, filter.end_date, filter.staff_id, 
      devices, filter.account_id 
    ]
    

    const result1 = await query(`SELECT * FROM basket WHERE
    date BETWEEN ? AND ? AND staff_id IN (?) AND device_id IN (?) 
    AND account_id = ? AND is_completed = 1 `, val)
    //const result1 = await query("SELECT * FROM basket ")

    if(result1.length > 0){
        for(var i = 0; i < result1.length; i++){
            try{
                let data = '%' + filter.keyword + '%';
                const result = await query(`SELECT p.name,p.description,p.cost_price,
                p.selling_price, b.quantity,b.discount_worth FROM basket_items AS b
                    LEFT JOIN product AS p 
                    ON b.product_id = p.id 
                    WHERE p.name LIKE ? `, data);
                //If above query produce more than one result
                if(result.length > 1){
                  result.forEach( res => {
                      if(res != null){ //if result is not empty
                        sales.push(res)
                      }
                  })
                }else{  //Just one result
                    if(result[0] != null){
                      sales.push(result[0])
                    }
                }
              }catch(err){
                  console.log(err)
            }
        }
        res.json(sales);
    }
} */

exports.get_sales_by_product = async(req, res, next) => {
  sales = [];
  
  var filter = {
    dateAction : req.body.dateAction,
    start_date : req.body.start_date,
    end_date : req.body.end_date,
    devices: req.body.devices,
    staff_id: req.body.staff_id,
    keyword: req.body.keyword,
    account_id : req.body.account_id
  }
  let data = '%' + filter.keyword + '%';
  let devices = [];
    filter.devices.forEach(element =>{
      devices.push(element.id)
    })
  val = [
        data, filter.start_date, filter.end_date, 
         filter.staff_id, devices, filter.account_id 
        ]
  
  try{
    const result = await query(`SELECT p.name,p.description,p.cost_price,
    p.selling_price, SUM(b.qty), SUM(b.discount_worth) AS  discount FROM basket_items AS b
         LEFT JOIN product AS p 
         ON b.product_id = p.id 
         WHERE p.name LIKE ?
         AND b.date_created BETWEEN ? AND ? AND b.staff_id IN (?) AND b.device_id IN (?) 
         AND b.account_id = ? AND b.is_completed = 1  GROUP BY p.name`, val);
    //If above query produce more than one result
    if(result.length > 1){
       result.forEach( res => {
          res['margin'] = res.selling_price - res.cost_price;
          num = ((res['margin'] / res.selling_price) * 100)
          res['percentage_margin'] = Math.round((num + Number.EPSILON) * 100) /100
          res['net_sale'] = (res.selling_price * res.qty) - res.discount
          if(res != null){
            sales.push(res)
          }
       })
    }else{  //Just one result
        if(result[0] != null){
          sales.push(result[0])
        }
    }
  }catch(err){
      console.log(err)
  }

  res.json(sales);
} 