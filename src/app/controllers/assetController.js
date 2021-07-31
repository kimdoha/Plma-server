const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const assetDao = require('../dao/assetDao');
const userDao = require('../dao/userDao');

exports.getBudget = async function (req, res) {
    try {
    var jwt = req.verifiedToken.id;
    const userIdRows = await userDao.getuser(jwt);
    var userId = userIdRows[0].userId;
    
    const getassetId = await assetDao.getassetId(userId);
    var asset = getassetId[0].asset;
    var money = 0;
    var getassetg = await assetDao.getassetg(userId);
    console.log(getassetg[0].money)
    for(var i=0; i < getassetg.length; i++){
        money = money + getassetg[i].money;
    }
    var total = Math.abs((money / asset)*100);
    console.log('total: ', total);
        
    return res.json({
        isSuccess: true,
        code: 1000,
        message: "예산 조회 성공",
        asset: asset,
        total: total,
        getassetg
      });

    } catch (err) {
        logger.error(`example non transaction DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }
};

exports.getmain = async function (req, res) {
    try {
        var jwt = req.verifiedToken.id;
        const userIdRows = await userDao.getuser(jwt);
        var userId = userIdRows[0].userId;
        
        const getassetId = await assetDao.getassetId(userId);
        var asset = getassetId[0].asset;
        var money = 0;
        var getassetg = await assetDao.getassetg(userId);
        console.log(getassetg[0].money)
        for(var i=0; i < getassetg.length; i++){
            money = money + getassetg[i].money;
        }
        var total = asset + money;
        console.log('total: ', total);
            
        return res.json({
            isSuccess: true,
            code: 1000,
            message: "예산 조회 성공",
            asset: asset,
            money: money,
            total: total,
          });
    } catch (err) {
        logger.error(`example non transaction DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }
};

exports.patchBudget = async function (req, res) {
    try {
    var jwt = req.verifiedToken.id;
    const userIdRows = await userDao.getuser(jwt);
    var userId = userIdRows[0].userId;
    const {asset} = req.body;

        const getassetId = await assetDao.getassetId(userId);
        var assetId = getassetId[0].assetId;
        const patchBudget = await assetDao.patchBudget(assetId, asset);
        console.log(patchBudget);
    
        if (patchBudget.affectedRows == 1) {
            return res.json({
              isSuccess: true,
              code: 1000,
              message: "예산 수정 성공"
            });
          } 
          else if(patchBudget.affectedRows == 0)
            return res.json({
              isSuccess: false,
              code: 3100,
              message: "이미 수정된 예산",
            });
        else return res.json({
            isSuccess: false,
            code: 4000,
            message: "예산 수정 실패",
          });
        
    } catch (err) {
        logger.error(`getGraph - Query error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
      }
};