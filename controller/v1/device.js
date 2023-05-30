const connection = require('../../database')
const util = require('util');

const query = util.promisify(connection.query).bind(connection);

exports.create_device = (req, res, next) => {
    var post = {
       name : req.body.name,
       location_area_id : req.body.location_area_id,
       status : req.body.status,
       code : req.body.code,
       is_assigned : req.body.is_assigned,
       user_id : req.body.user_id,
       account_id : req.body.account_id
    }

    const sql = "INSERT INTO device SET ?";
    var query = connection.query(
        sql, post, function(error, results, fields){
            if(error) throw error;
            res.json(results);
        }
    );
}

exports.get_all_devices_by_account_id = async(req, res, next) => {
    try{
        const result2 = await query("SELECT * FROM device WHERE account_id = ?", req.params.account_id)
        if(result2.length > 0){
          for(var i = 0; i < result2.length; i++){
            var values = [result2[i].location_area_id, req.params.account_id]
            const result3 = await query("SELECT * FROM location_area WHERE id = ? AND account_id = ?", values)
            result2[i]['location_name'] = result3[0].name;
          }  
           res.json(result2);
        }else{
          res.json(devices);
        }
    }catch(err){
       console.log(err)
    }
}

exports.getA_device_by_id =  async(req, res, next) => {
  try{
    var data = [req.params.device_id, req.params.account_id]
    const result =  await query("SELECT * FROM device WHERE id = ? AND account_id = ?", data)
    if(result.length > 0){
      for(var i = 0; i < result.length; i++){
        var values = [result[0].location_area_id, req.params.account_id]
        const result2 = await query("SELECT * FROM location_area WHERE id = ? AND account_id = ?", values)
        result[i]['location_name'] = result2[0].name;
      }  
       res.json(result[0]);
    }else{
      res.json(devices);
    }
  }catch(err){
    console.log(err)
  }
}

exports.update_device_code = (req, res, next) => {
  var post = {
    device_code : req.body.device_code,
    is_assigned : req.body.is_assigned,
    account_id : req.body.account_id,
    device_id : req.body.device_id
  }

  values = [post.device_code, post.is_assigned, post.account_id, post.device_id]
  const sql = "UPDATE device SET code = ?, is_assigned = ? WHERE account_id = ? AND id = ?"
  connection.query(
    sql, values, function(error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  );
} 

exports.update_device_info = (req, res, next) => {
  var post = {
    account_id : req.body.account_id, 
    device_id : req.body.id,  
    location_area_id : req.body.location_area_id,
    status : req.body.status,
    user_id : req.body.user_id
  }
  
  const values = [
    post.location_area_id, 
    post.status, 
    post.user_id, 
    parseInt(post.account_id), 
    post.device_id
  ]

  const sql = "UPDATE device SET location_area_id = ?, status = ?, user_id = ? WHERE account_id = ? AND id = ?"
  connection.query(
    sql, values, function(error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  );
} 

exports.get_all_devices_by_l_area_id = (req, res, next) => {
  let sql;
  values = [req.params.account_id, req.params.l_area_id];
  if(req.params.l_area_id == 0){
    sql = "SELECT * FROM device WHERE account_id = ? AND location_area_id NOT IN (?) ";
    
  }else{
    sql = "SELECT * FROM device WHERE account_id = ? AND location_area_id IN (?) ";
  }
  
  connection.query(
    sql, values, function(error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  ); 
}

exports.get_all_devices_by_device_id = (req, res, next) => {
  let sql
  values = [req.params.account_id, req.params.device_id.split(",")];
  
  if(req.params.device_id == 0){
    sql = "SELECT * FROM device WHERE account_id = ? AND id NOT IN (?) ";
    
  }else{
    sql = "SELECT * FROM device WHERE account_id = ? AND id IN (?) ";
  }
  
  connection.query(
    sql, values, function(error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  ); 
}

exports.get_all_devices_by_device_code = (req, res, next) => {
  let sql
  values = [req.params.d_code, req.params.account_id];
  
  if(req.params.code == 0){
    sql = "SELECT * FROM device WHERE code = ? AND  account_id = ?";
  }else{
    sql = "SELECT * FROM device WHERE code = ? AND account_id = ?";
  }
  
  connection.query(
    sql, values, function(error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  ); 
}

exports.is_device_assigned = (req, res, next) => {
  let sql
  values = [req.params.d_code, req.params.account_id];
  
  if(req.params.code == 0){
    sql = "SELECT * FROM device WHERE code = ? AND  account_id = ?";
  }else{
    sql = "SELECT * FROM device WHERE code = ? AND account_id = ?";
  }
  
  connection.query(
    sql, values, function(error, results, fields) {
      if (error) throw error;
      res.json(results[0].is_assigned);
    }
  ); 
}