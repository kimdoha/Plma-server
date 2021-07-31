const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const assetDao = require('../dao/assetDao');
const productDao = require('../dao/productDao');
const userDao = require('../dao/userDao');


//위시리스트 조회
exports.getproducts = async function (req, res) {
    try {
        var jwt = req.verifiedToken.id;
        const userIdRows = await userDao.getuser(jwt);
        var userId = userIdRows[0].userId;

        const getproducts = await productDao.getproducts(userId);

        return res.json({
            isSuccess: true,
            code: 200,
            message: "위시리스트 조회",
            result: getproducts
        });
    } catch (err) {
        logger.error(`example non transaction DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }
};

//살래안살래API
exports.patchproducts = async function (req, res) {
    try {
        var jwt = req.verifiedToken.id;
        const userIdRows = await userDao.getuser(jwt);
        var userId = userIdRows[0].userId;
        
        const {cartId, isSuccess} = req.body;

        const getassetId = await assetDao.getassetId(userId);
        var assetId = getassetId[0].assetId;

        const patchproducts = await productDao.patchproducts(cartId, isSuccess);
        const getproductPrice = await productDao.getproductPrice(cartId);
        console.log(getproductPrice[0].productPrice)
        if (isSuccess == 1){
            const postAcount = await productDao.postPAcount(userId, assetId, getproductPrice[0].productPrice);
        }
        else if (isSuccess == -1){
            const postAcount = await productDao.postMAcount(userId, assetId, getproductPrice[0].productPrice);
        }

        return res.json({
            isSuccess: true,
            code: 200,
            message: "살래안살래 결정 완료"
        });
    } catch (err) {
        logger.error(`example non transaction DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }
};