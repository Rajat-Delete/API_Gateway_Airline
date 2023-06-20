const { StatusCodes } =  require('http-status-codes');
const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const {UserService} = require('../services');

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

async function checkAuth(request,response,next){
    try {
        const res = await UserService.isAuthenticatedUser(request.headers['x-access-token']);
        //Now for every user we will be storing the Id of the user in Request so that later on we can get to know which user created the booking
        if(res){
            request.user = res;
            console.log('request object>>', request);
            next();
        }

    } catch (error) {
        return response
        .status(error.statusCode)
        .json(error);
    }
}

module.exports = {
    validateAuthRequest,
    checkAuth
}