const { UserRepository } = require('../repositories');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');

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

module.exports = {
    createUser
}