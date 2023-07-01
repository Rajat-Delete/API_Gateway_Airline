const { UserRepository, RoleRepository } = require('../repositories');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const {Auth, Enums} = require('../utils/common');
const userRepository = new UserRepository();
const roleRepository = new RoleRepository();


async function createUser(data){
    try {
        console.log('UserRepo>>',userRepository);
        const user = await userRepository.create(data);
        console.log('user in service>>',user);
        const role = await roleRepository.getRoleByName(Enums.USER_ROLES.CUSTOMER);
        user.addRole(role);
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


async function isAuthenticatedUser(token){
    try {
        //if token is not present then we will throw a new error 
        if(!token){
            throw new AppError('Missing JWT Token', StatusCodes.BAD_REQUEST);
        }
        const response = Auth.verifyToken(token);
        /*
        Post verifying the token we will be getting the same input which we have used for creating the token 

        {
        id: 9,
        email: 'testinguser@icicibank.com',
        iat: 1687282426,
        exp: 1687286026
        }
        */
        console.log(response);



        /*
        Now we have validated the token but if there some details of our secret key are compromised and
        we are getting the request from a random email. So better to validate the user Id as well post authentication.
        */
       const user = await userRepository.get(response.id);
       if(!user){
            throw new AppError('UserId not found in the Database',StatusCodes.NOT_FOUND);
       }
       return user.id; 
    } catch (error) {
        if(error instanceof AppError) throw error;
        if(error.name == 'JsonWebTokenError'){
            throw new AppError('Invalid JWT Token', StatusCodes.BAD_REQUEST);
        }
        if(error.name == 'TokenExpiredError'){
            throw new AppError('JWT Token Expired', StatusCodes.BAD_REQUEST);
        }
        console.log(error);
        throw error;
    }
}

async function addRoleToUser(data){
    try {
        const user = await userRepository.get(data.id);
        if(!user){
            throw new AppError('Unable to found User', StatusCodes.NOT_FOUND);
        }
        const role = await roleRepository.getRoleByName(data.role);
        if(!role){
            throw new AppError('Unable to find the Role',StatusCodes.NOT_FOUND);
        }
        user.addRole(role);
        return user;
    } catch (error) {
        if(error instanceof AppError) throw error;
        console.log('Error Found>>',error);
        throw new AppError('Something Went Wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAdmin(id){
    try {
        const user = await userRepository.get(id);
        if(!user){
            throw new AppError('No User found for the given role',StatusCodes.NOT_FOUND);
        }
        console.log('here')
        const adminrole = await roleRepository.getRoleByName(Enums.USER_ROLES.ADMIN);
        if(!adminrole){
            throw new AppError('No User found for the given role',StatusCodes.NOT_FOUND);
        }
        //console.log('rajat>>',user.hasRole(adminrole));
        return user.hasRole(adminrole);
    } catch (error) {
        if(error instanceof AppError) throw error;
        console.log('Error Found>>',error);
        throw new AppError('Something Went Wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}



module.exports = {
    createUser,
    signin,
    isAuthenticatedUser,
    addRoleToUser,
    isAdmin
}