const routes = require('./routes');
const setupMount = require('../common/utils').setupMount;

module.exports.mount = (app) => {
  return setupMount('external', app, routes);
};
