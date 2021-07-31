module.exports = function(app){
    const ranking = require('../controllers/rankingController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


    app.get('/ranking', jwtMiddleware, ranking.getRanking);

    app.get('/oct', jwtMiddleware, ranking.getOctNumber);
    app.get('/product/info', jwtMiddleware, ranking.getProductInfo );
    
    app.post('/product',jwtMiddleware,ranking.setProduct);
    app.post('/product/:cartId',jwtMiddleware,ranking.deleteProduct);
    app.post('/user/character/:type',jwtMiddleware,ranking.updateCharType);


};