import history from "../DAO/historyDAO.js";
import appException from "../service/appException.js";


function create() {
    async function query() {
        return history.query();
    }

    async function insert(data) {
        return history.insert(data);
    }

    async function clear() {
        return history.clear();
    }


    return {
      query: query,
      insert: insert,
      clear: clear
    };
}

export default {
    create: create
};
