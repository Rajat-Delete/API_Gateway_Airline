const {UserService}  =require('../services');
const {StatusCodes} = require('http-status-codes');
const {SuccesResponse , ErrorResponse} = require('../utils/common')

async function signUp(request,response){
    try{
        const resp = await UserService.createUser({
            email: request.body.email,
            password : request.body.password
        });
        console.log('resp in controller',resp);
        SuccesResponse.data = resp;
        return response
        .status(StatusCodes.OK)
        .json(SuccesResponse);
    }
    catch(error){
        ErrorResponse.error = error;
        return response
        .status(error.statusCode)
        .json(ErrorResponse);
    }

}

async function signIn(request,response){
    try{
        const resp = await UserService.signin({
            email: request.body.email,
            password : request.body.password
        });
        console.log('resp in singin controller',resp);
        SuccesResponse.data = resp;
        return response
        .status(StatusCodes.OK)
        .json(SuccesResponse);
    }
    catch(error){
        ErrorResponse.error = error;
        return response
        .status(error.statusCode)
        .json(ErrorResponse);
    }

}



async function addRoleToUserController(request,response){
    try {
        const resp = await UserService.addRoleToUser({
            id : request.body.id,
            role: request.body.role
        });
       // console.log(resp);
        SuccesResponse.data=resp;
        return response
        .status(StatusCodes.OK)
        .json(SuccesResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return response
        .status(error.statusCode)
        .json(ErrorResponse);
    }
}

module.exports={
    signUp,
    signIn,
    addRoleToUserController
}