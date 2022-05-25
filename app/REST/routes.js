import sectionEndpoint from "./sectionEndpoint.js";
import spaceEndpoint from "./spaceEndpoint.js";
import historyEndpoint from "./historyEndpoint.js";
import userEndpoint from "./userEndpoint.js";



const routes = function (app) {
  sectionEndpoint(app);
  spaceEndpoint(app);
  historyEndpoint(app);
  userEndpoint(app);
};

export default routes;
