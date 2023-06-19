const { UserRepository } = require('../repositories');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const {Auth} = require('../utils/common')
const userRepository = new UserRepository();

async function createUser(data){
    try {
        console.log('UserRepo>>',userRepository);
        const user = await userRepository.create(data);
        console.log('user in service>>',user);
        return user;
    } catch (error) {
        console.log(error);
        if(error.name == 'TypeError'){
            throw new AppError('Something went wrong while creating the user object', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        //code added for validating the user and unique constraint for user
        if(error.name == 'SequelizeValidationError' ||error.name == 'SequelizeUniqueConstraintError'){
            let explanation =[];
            error.errors.forEach(element => {
                explanation.push(element.message);
            });

            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw error;
    }

}


async function signin(data){
    try {
        const user = await userRepository.getUserByEmail(data.email);
        if(!user){
            throw new AppError('User not found with the Given EmailId',StatusCodes.NOT_FOUND);
        }
        const passwordMatch = Auth.comparePassword(data.password, user.password);
        if(!passwordMatch){
            throw new AppError('Password is Incorrect in the request',StatusCodes.BAD_REQUEST);
        }
        const jwtToken  = Auth.createJWTToken({id : user.id ,email : user.email });
        return jwtToken;
    } catch (error) {
        console.log(error);
        if(error instanceof AppError){
            throw error;
        }
        throw new AppError('An Error Occured while creating SignIn',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}



module.exports = {
    createUser,
    signin
}