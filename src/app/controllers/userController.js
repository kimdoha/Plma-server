const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const jwt = require('jsonwebtoken');
const regexEmail = require('regex-email');
const crypto = require('crypto');
const secret_config = require('../../../config/secret');

const userDao = require('../dao/userDao');
const { constants } = require('buffer');
const { connect } = require("http2");

/**
 01.signUp API = 회원가입
 */
exports.signUp = async function (req, res) {
    const {
        id, password, nickname
    } = req.body;

    if (!id) return res.json({isSuccess: false, code: 3001, message: "아이디를 입력해주세요."});
    if (id.length > 30) return res.json({
        isSuccess: false,
        code: 3002,

        message: "아이디는 30자리 미만으로 입력해주세요."
    });

    if (!password) return res.json({isSuccess: false, code: 304, message: "비밀번호를 입력 해주세요."});
    if (password.length < 6 || password.length > 20) return res.json({
        isSuccess: false,
        code: 3005,
        message: "비밀번호는 6~20자리를 입력해주세요."
    });

    if (!nickname) return res.json({isSuccess: false, code: 306, message: "닉네임을 입력 해주세요."});
    if (nickname.length > 20) return res.json({
        isSuccess: false,
        code: 3007,
        message: "닉네임은 최대 20자리를 입력해주세요."
    });
        try {
            // 이메일 중복 확인
            const idRows = await userDao.useridCheck(id);
            if (idRows.length > 0) {
                return res.json({
                    isSuccess: false,
                    code: 3008,
                    message: "중복된 아이디입니다."
                });
            }

            // 닉네임 중복 확인
            const nicknameRows = await userDao.userNicknameCheck(nickname);
            if (nicknameRows.length > 0) {
                return res.json({
                    isSuccess: false,
                    code: 3009,
                    message: "중복된 닉네임입니다."
                });
            }

            const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex');
            const insertUserInfoParams = [id, hashedPassword, nickname];
            

            const [user] = await userDao.getUserId(id);
            var userId = user.userId;
            console.log(userId);

            
            const getAssetBalanceRows = await userDao.getAssetIdAndBalanceId(userId);
            console.log(getAssetBalanceRows.length);
            if (getAssetBalanceRows.length < 1) {
                return res.json({
                    isSuccess: false,
                    code: 310,
                    message: "assetId와 balanceId가 생성되지 않았습니다."
                });
            }

            var assetId = getAssetBalanceRows[0].assetId;
            var balanceId = getAssetBalanceRows[0].balanceId;
            const insertAccountRows = await userDao.insertAccount(userId, assetId, balanceId);



            return res.json({
                isSuccess: true,
                code: 1000,
                message: "회원가입 성공"
            });
        } catch (err) {

            logger.error(`App - SignUp Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }
};

/**
 update : 2020.10.4
 02.signIn API = 로그인
 **/
exports.signIn = async function (req, res) {
    const {
        id, password
    } = req.body;

    if (!id) return res.json({isSuccess: false, code: 301, message: "아이디를 입력해주세요."});
    if (id.length > 30) return res.json({
        isSuccess: false,
        code: 3002,
        message: "이메일은 30자리 미만으로 입력해주세요."
    });

    if (!password) return res.json({isSuccess: false, code: 3004, message: "비밀번호를 입력 해주세요."});
        try {
            const [userInfoRows] = await userDao.selectUserInfo(id)

            if (userInfoRows.length < 1) {
                connection.release();
                return res.json({
                    isSuccess: false,
                    code: 3010,
                    message: "아이디를 확인해주세요."
                });
            }

            const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex');

            if (hashedPassword == userInfoRows[0].password){
                
            let token = await jwt.sign({
                id: userInfoRows[0].id,
            }, 
            secret_config.jwtsecret, 
            {
                expiresIn: '365d',
                subject: 'userInfo',
            }
            );

            return res.json({
                userInfo: userInfoRows[0],
                jwt: token,
                isSuccess: true,
                code: 1000,
                message: "로그인 성공"
            });
            }

            else return res.json({isSuccess: false, code: 3011, message: "비밀번호를 잘못입력"});

        } catch (err) {
            logger.error(`App - SignIn Query error\n: ${JSON.stringify(err)}`);
            connection.release();
            return false;
        }
};

/**
 update : 2019.09.23
 03.check API = token 검증
 **/
exports.check = async function (req, res) {
    res.json({
        isSuccess: true,
        code: 200,
        message: "검증 성공",
        info: req.verifiedToken
    })
};