import sectionManager from './section.manager.js';
import spaceManager from './space.manager.js';
import historyManager from './history.manager.js';
import userManager from './user.manager.js';

function getter(manager, request) {
  return function () {
    return manager.create(request, this);
  };
}

export default {
    getSectionManager: getter(sectionManager),
    getSpaceManager: getter(spaceManager),
    getHistoryManager: getter(historyManager),
    getUserManager: getter(userManager),
};
