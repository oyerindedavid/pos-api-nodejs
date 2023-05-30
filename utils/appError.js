const connection = require('../database');
const util = require('util');
const query = util.promisify(connection.query).bind(connection);


class AppError extends Error{

    constructor(message, statusCode, userEvent, accountId){
        super(message);
        this.statusCode = statusCode;
        this.userEvent = userEvent;
        this.accountId = accountId;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }


   async logError(){
        const post =  {
            status : this.statusCode || 500,
            message : this.message,
            event : this.userEvent,
            account_id : this.accountId,
            stack : this.stack
        }

        try{
            const result = await query("INSERT INTO errors SET ?", post)
        }catch(err){
            throw err
        }
        
    }
    
}

module.exports = AppError;