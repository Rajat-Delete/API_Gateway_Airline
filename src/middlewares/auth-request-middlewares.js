const { StatusCodes } =  require('http-status-codes');
const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');


function validateAuthRequest(request, response, next){
    console.log('code inside validate request of Auth Middlewares');
    if(!request.body.email){
        ErrorResponse.message = 'Something Went Wrong while Authenticating User';
        ErrorResponse.error = new AppError({'Explanation': 'email was not found in Incoming Request'}, StatusCodes.BAD_REQUEST);
        return response
        .status(StatusCodes.BAD_REQUEST)
        .json(ErrorResponse)
        
    }
     if(!request.body.password){
        ErrorResponse.message = 'Something Went Wrong while Authenticating User';
        ErrorResponse.error = new AppError({'Explanation': 'password was not found in Incoming Request'}, StatusCodes.BAD_REQUEST);
        return response
        .status(StatusCodes.BAD_REQUEST)
        .json(ErrorResponse)
        
    }
    next();

}

module.exports = {
    validateAuthRequest
}