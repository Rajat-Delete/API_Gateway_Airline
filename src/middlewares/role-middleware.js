const { StatusCodes } =  require('http-status-codes');
const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');

async function validateRoleandId(request,response,next){
    if(!request.body.id){
        ErrorResponse.message = 'Something Went Wrong while Adding Role User';
        ErrorResponse.error = new AppError({'Explanation': 'User Id was not found in Incoming Request'}, StatusCodes.BAD_REQUEST);
        return response
        .status(StatusCodes.BAD_REQUEST)
        .json(ErrorResponse)
    }

    if(!request.body.role){
        ErrorResponse.message = 'Something Went Wrong while Adding Role User';
        ErrorResponse.error = new AppError({'Explanation': 'Role Id was not found in Incoming Request'}, StatusCodes.BAD_REQUEST);
        return response
        .status(StatusCodes.BAD_REQUEST)
        .json(ErrorResponse)
    }
    next();
} 

module.exports ={
    validateRoleandId
} 