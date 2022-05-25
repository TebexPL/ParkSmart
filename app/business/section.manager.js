import sections from "../DAO/sectionDAO.js";
import spaces from "../DAO/spaceDAO.js";
import appException from "../service/appException.js";


function create() {
    async function query() {
        return sections.query();
    }

    async function insert(data) {
    	if(!data.name)
            throw appException.new(appException.BAD_REQUEST, "Section name must be specified");
        else if(await sections.nameExists(data.name))
            throw appException.new(appException.CONFLICT, "Section already exists");
    	else if(!data.cost)
            throw appException.new(appException.BAD_REQUEST, "Section cost must be specified");
        else if(isNaN(data.cost))
            throw appException.new(appException.BAD_REQUEST, "Section cost needs to be a number");
    	else if(data.cost < 0)
            throw appException.new(appException.BAD_REQUEST, "Section cost cannot be less than 0");

        return await sections.insert(data);
    }

    async function update(data) {
      if(!data.sectionID)
          throw appException.new(appException.BAD_REQUEST, "Section ID must be specified");
      else if(! await sections.idExists(data.sectionID))
          throw appException.new(appException.CONFLICT, "Section does not exist");
    	if(!data.name)
            throw appException.new(appException.BAD_REQUEST, "Section name must be specified");
      else if(await sections.nameExists(data.name) && (await sections.nameExists(data.name))._id != data.sectionID)
            throw appException.new(appException.CONFLICT, "Section already exists");
    	else if(!data.cost)
            throw appException.new(appException.BAD_REQUEST, "Section cost must be specified");
        else if(isNaN(data.cost))
            throw appException.new(appException.BAD_REQUEST, "Section cost needs to be a number");
    	else if(data.cost < 0)
            throw appException.new(appException.BAD_REQUEST, "Section cost cannot be less than 0");

        return await sections.update(data);
    }

    async function remove(data) {
        if(!data.sectionID)
            throw appException.new(appException.BAD_REQUEST, "Section ID must be specified");
        else if(! await sections.idExists(data.sectionID))
            throw appException.new(appException.CONFLICT, "Section does not exist");
        await spaces.removeInSection(data.sectionID);
        return await sections.remove(data.sectionID);
    }


    return {
      query: query,
      insert: insert,
      update: update,
      remove: remove,
    };
}

export default {
    create: create
};
