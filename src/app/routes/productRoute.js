module.exports = function(app){
    const product = require('../controllers/productController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.get('/products', jwtMiddleware, product.getproducts);
    app.patch('/products', jwtMiddleware, product.patchproducts);
};