const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const rankingDao = require('../dao/rankingDao');
const userDao = require('../dao/userDao');



exports.getRanking = async function (req, res) {
    try {
        var jwt = req.verifiedToken.id;
        const userIdRows = await userDao.getuser(jwt);
        var userId = userIdRows[0].userId;

        const getRank = await rankingDao.getRank();
        const getMyRank = await rankingDao.getMyRank(userId);
        console.log(getMyRank)
        return res.json({
            isSuccess: true,
            code: 200,
            message: "전체 랭킹과 내 랭킹 확인",
            getRank: getRank,
            getMyRank: getMyRank[0],
        });
    } catch (err) {
        logger.error(`example non transaction DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }
};


exports.getOctNumber = async function (req, res) {

    try {
        
        const connection = await pool.getConnection(async conn => conn);
        try {
            var jwt = req.verifiedToken.id;
            const userIdRows = await userDao.getuser(jwt);
            var userId = userIdRows[0].userId;
            console.log(userId);

            const tesseract = require("node-tesseract-ocr")

            const config = {
                lang: "eng",
                oem: 1,
                psm: 3,
            }

            const img = "http://www.busan.com/nas/data/content/image/1998/02/27/19980227000080_0.jpg"

            tesseract
              .recognize(img, config)
              .then((text) => {
                console.log("Result:", text);
                return res.json({
                    isSuccess: true,
                    code: 200,
                    message: "글자인식 성공",
                    result: text
                    
                });

            })
              .catch((error) => {
                console.log(error.message)
              })

        } catch (err) {
            logger.error(`Get Oct transaction Query error\n: ${JSON.stringify(err)}`);
            connection.release();
            return false;
        }
    } catch (err) {
        logger.error(`Get Oct transaction DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }
};

exports.getProductInfo = async function (req, res) {
    try {
        
        const connection = await pool.getConnection(async conn => conn);
        try {
            var jwt = req.verifiedToken.id;
            const userIdRows = await userDao.getuser(jwt);
            var userId = userIdRows[0].userId;
            console.log(userId);

            const [rows] = await rankingDao.getMyProduct(userId);
            console.log(rows);
            return res.json({
                isSuccess: true,
                code: 200,
                message: "내 장바구니 상품 목록 조회 성공",
                result: rows
                
            });

        } catch (err) {
            logger.error(`Get My Cart transaction Query error\n: ${JSON.stringify(err)}`);
            connection.release();
            return false;
        }
    }  catch (err) {
        logger.error(`example non transaction DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }
};

exports.setProduct = async function (req, res) {
        const jwt = req.verifiedToken.id;
        const userIdRows = await userDao.getuser(jwt);
        var userId = userIdRows[0].userId;
        console.log(userIdRows[0]);

        const { productName, productPrice, productImg } = req.body;
        console.log(req.body);
        console.log(productName, productImg, productPrice);
        if(productImg){
            console.log(userId)
            console.log(productName)
            console.log(productPrice)
            console.log(productImg)

            const rows = await rankingDao.setMyProduct1(userId, productName, productPrice, productImg);
            console.log(rows);
        } else {
            console.log(2)
            const rows = await rankingDao.setMyProduct2(userId, productName, productPrice);
        }
        return res.json({
            isSuccess: true,
            code: 200,
            message: "내 장바구니 상품 등록 성공"
        });
};

exports.deleteProduct  = async function (req, res) {
    const jwt = req.verifiedToken.id;
    const userIdRows = await userDao.getuser(jwt);
    var userId = userIdRows[0].userId;
    console.log(userIdRows[0]);

    const cartId = req.params.cartId;
    if(!cartId)
        return res.json({
            isSuccess: false,
            code: 210,
            message: "장바구니 인덱스를 입력해주세요."
        });
    var regExp = /^[0-9]+$/;
    if(!regExp.test(cartId))
        return res.json({
            isSuccess: false,
            code: 211,
            message: "숫자로 입력해주세요."
        });

    const [rows] = await rankingDao.updateProduct(cartId, userId);
    console.log(rows);

    return res.json({
        isSuccess: true,
        code: 200,
        message: "내 장바구니 상품 삭제 성공"
    });
};


exports.updateCharType = async function (req, res) {
    const jwt = req.verifiedToken.id;
    const userIdRows = await userDao.getuser(jwt);
    var userId = userIdRows[0].userId;
    console.log(userIdRows[0]);

    const type = req.params.type;
    var regExp = /^[0-9]+$/;
    if(!regExp.test(type))
        return res.json({
            isSuccess: false,
            code: 211,
            message: "숫자로 입력해주세요."
        });
    if(type < 1 || type > 4)
        return res.json({
            isSuccess: false,
            code: 212,
            message: "1-4사이의 숫자로 입력해주세요"
        });

    const rows = await rankingDao.updateType(type, userId);

    return res.json({
        isSuccess: true,
        code: 200,
        message: "캐릭터 타입 설정 성공"
    });
};

