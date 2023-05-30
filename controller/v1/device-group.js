const connection = require('../../database')
const util = require('util');
const { group } = require('console');

const query = util.promisify(connection.query).bind(connection);

exports.create_device_group = (req, res, next) => {
   let devices = [];
   req.body.devices.forEach(element => {
     devices.push(element.id)
   });
   
    var post = {
       name : req.body.name,
       devices : devices.toString(),
       user_id : req.body.user_id,
       account_id : req.body.account_id
    }

    const sql = "INSERT INTO device_group SET ?";
    var query = connection.query(
        sql, post, function(error, results, fields){
            if(error) throw error;
            res.json(results);
        }
    );
}

exports.get_all_device_group_by_account_id = async(req, res, next) => {
    let device_group = []

    try{
      // Get all the device group
      const results = await query("SELECT * FROM device_group WHERE account_id = ? ", req.params.account_id);
      if(results.length > 0){   //if this group exist
        for(let i = 0; i < results.length; i++){
          group_devices = results[i].devices.split(",")  //Convert device ids from string to array
          let devices = [] 
            if(group_devices.length > 0){ 
              for(let x = 0; x < group_devices.length; x++){
                let values = [req.params.account_id, group_devices[x]]
                const results2 = await query("SELECT * FROM device WHERE account_id = ? AND id = ?", values)
                devices.push(results2[0].name + ' ')
                results[i]['device_name'] = devices
              }
            }
        }
        res.json(results)
      }else{
        res.json(device_group)
      }
    }catch(err){
      console.log(err)
    }
}