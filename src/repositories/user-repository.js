const CrudRepository = require('../repositories/crud-repository');

const { user } = require('../models');

class UserRepository extends CrudRepository {

    constructor(){
        super(user);
    }

}

module.exports = UserRepository;
