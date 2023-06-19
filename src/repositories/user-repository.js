const CrudRepository = require('../repositories/crud-repository');

const { user } = require('../models');

class UserRepository extends CrudRepository {

    constructor(){
        super(user);
    }

    async getUserByEmail(email){
        const response = await user.findOne({where : {email: email}});
        return response;
    }

}

module.exports = UserRepository;
