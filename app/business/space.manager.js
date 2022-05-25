import sections from "../DAO/sectionDAO.js";
import spaces from "../DAO/spaceDAO.js";
import history from "../DAO/historyDAO.js";
import appException from "../service/appException.js";


function create() {
    async function query() {
        return spaces.query();
    }

    async function queryInSection(data) {
      if(!data.sectionID)
        throw appException.new(appException.BAD_REQUEST, "Section ID must be specified");
      if(! await sections.idExists(data.sectionID))
          throw appException.new(appException.CONFLICT, "Section does not exist");
      return await spaces.queryInSection(data.sectionID);
    }



    async function insert(data) {
      if(!data.sectionID)
        throw appException.new(appException.BAD_REQUEST, "Section ID must be specified");
      if(! await sections.idExists(data.sectionID))
          throw appException.new(appException.CONFLICT, "Section does not exist");
      if(!data.name)
            throw appException.new(appException.BAD_REQUEST, "Space name must be specified");
      if((await spaces.queryInSection(data.sectionID)).find((e)=>e.name===data.name))
            throw appException.new(appException.CONFLICT, "Space already exists");

        return await spaces.insert(data);
    }

    async function updateTaken(data) {
      if(!data.spaceID)
        throw appException.new(appException.BAD_REQUEST, "Space ID must be specified");
      if(! await spaces.idExists(data.spaceID))
          throw appException.new(appException.CONFLICT, "Space does not exist");

      data.since = Date.now();

      if(data.taken==false){
        const space = await spaces.queryId(data.spaceID)
        const section = await sections.queryId(space.sectionID);
        let cost = new Date(data.since).getTime()-new Date(space.since).getTime();
        cost = ((Math.floor((cost)/1000))/60)/60;
        cost = cost*section.cost;
        cost = Math.round(cost*100)/100;

        const historyData = { sectionID:section._id,
                          spaceID: space._id,
                          since:space.since,
                          to: data.since,
                          cost: cost
                        }
        await history.insert(historyData);
      }
      await spaces.updateTaken(data);
    }

    async function updateName(data) {
      if(!data.spaceID)
        throw appException.new(appException.BAD_REQUEST, "Space ID must be specified");
      if(!data.name)
        throw appException.new(appException.BAD_REQUEST, "Space name must be specified");
      if(! await spaces.idExists(data.spaceID))
          throw appException.new(appException.CONFLICT, "Space does not exist");
      if((await spaces.queryInSection((await spaces.queryId(data.spaceID)).sectionID)).find((e)=>e.name===data.name))
          throw appException.new(appException.CONFLICT, "Space name already exists");

      return await spaces.updateName(data);
    }



    async function remove(data) {
        if(!data.spaceID)
            throw appException.new(appException.BAD_REQUEST, "Space ID must be specified");
        else if(! await spaces.idExists(data.spaceID))
            throw appException.new(appException.CONFLICT, "Space does not exist");
        return await spaces.remove(data.spaceID);
    }


    return {
      query: query,
      queryInSection: queryInSection,
      insert: insert,
      updateTaken: updateTaken,
      updateName: updateName,
      remove: remove,
    };
}

export default {
    create: create
};
