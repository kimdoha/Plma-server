module.exports = function(app){
  const asset = require('../controllers/assetController');
  const jwtMiddleware = require('../../../config/jwtMiddleware');

  app.get('/main', jwtMiddleware, asset.getmain);
  app.get('/budget', jwtMiddleware, asset.getBudget);
  app.patch('/budget', jwtMiddleware, asset.patchBudget);
};