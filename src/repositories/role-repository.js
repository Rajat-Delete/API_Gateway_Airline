const CrudRepository = require('../repositories/crud-repository');

const { Role } = require('../models');

class RoleRepository extends CrudRepository {

    constructor(){
        super(Role);
    }

    async getRoleByName(name){
        console.log('rajat',name);
        console.log(Role);
        const response = await Role.findOne({where : {name: name}});
        return response;
    }

}

module.exports = RoleRepository;
