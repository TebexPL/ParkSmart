import users from "../DAO/userDAO.js";
import tokens from "../DAO/tokenDAO.js";
import appException from "../service/appException.js";
import sha1 from "sha1";


function create() {

  async function auth(data) {
    if(!data.name || !data.password)
      throw appException.new(appException.BAD_REQUEST, "Username and password must be specified");
    if(! await users.nameExists(data.name))
        throw appException.new(appException.CONFLICT, "Username or passwoord is invalid");

    const user = await users.queryName(data.name);
    if(sha1(data.password) !== user.password )
        throw appException.new(appException.CONFLICT, "Username or passwoord is invalid");

    const token = await tokens.create(user._id);
    const result = {};
    result.token = token.value;
    return result;
  }

  async function logout(data) {
    if(!data.token)
      throw appException.new(appException.BAD_REQUEST, "This shouldn't happen");
    if(! await tokens.exists(data.token))
      throw appException.new(appException.BAD_REQUEST, "Invalid token");
    tokens.remove(data.token);

  }

    return {
      auth: auth,
      logout: logout
    };
}

export default {
    create: create
};
