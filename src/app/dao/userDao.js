const { pool } = require("../../../config/database");

// Signup
async function useridCheck(id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectidQuery = `
                SELECT id, password
                FROM User
                WHERE id = ?;
                `;
  const selectidParams = [id];
  const [idRows] = await connection.query(
    selectidQuery,
    selectidParams
  );
  connection.release();

  return idRows;
}

async function userNicknameCheck(nickname) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectNicknameQuery = `
                SELECT id, nickname 
                FROM User 
                WHERE nickname = ?;
                `;
  const selectNicknameParams = [nickname];
  const [nicknameRows] = await connection.query(
    selectNicknameQuery,
    selectNicknameParams
  );
  connection.release();
  return nicknameRows;
}

async function insertUserInfo(insertUserInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const insertUserInfoQuery = `
        INSERT INTO User(id, password, nickname)
        VALUES (?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );
  connection.release();
  return insertUserInfoRow;
}


async function getUserId(id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getUserInfoQuery = `
    SELECT userId FROM User WHERE id = ?;
    `;
  const [getUserInfoRow] = await connection.query(getUserInfoQuery, id);
  connection.release();
  return getUserInfoRow;
}

async function insertAssetInfo(userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const insertAssetInfoQuery = `
      INSERT INTO Asset(userId) VALUES(?);
    `;
  const [insertAssetInfoRow] = await connection.query(insertAssetInfoQuery , userId);
  connection.release();
  return insertAssetInfoRow;
}

async function insertBalanceInfo(userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const insertBalanceInfoQuery = `
      INSERT INTO Balance(userId) VALUES(?);
    `;
  const [insertBalanceInfoRow] = await connection.query(insertBalanceInfoQuery , userId);
  connection.release();
  return insertBalanceInfoRow;
}
async function getAssetIdAndBalanceId(userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getUserInfoQuery = `
      SELECT assetId, balanceId
      FROM Asset a
      LEFT OUTER JOIN Balance b ON a.userId = b.userId
      WHERE a.userId = ? AND b.userId = ?;
    `;
  const [getUserInfoRow] = await connection.query(getUserInfoQuery, [ userId, userId]);
  connection.release();
  return getUserInfoRow;
}

async function insertAccount(userId, assetId, balanceId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const insertAccountQuery = `
      INSERT INTO Account(userId, assetId, balanceId) VALUES(?, ?, ?);
    `;
  const [accountRow] = await connection.query(insertAccountQuery, [userId, assetId, balanceId]);
  connection.release();
  return accountRow;
}

//SignIn
async function selectUserInfo(id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectUserInfoQuery = `
                SELECT userId, id, password, nickname, status 
                FROM User 
                WHERE id = ?;
                `;

  let selectUserInfoParams = [id];
  const [userInfoRows] = await connection.query(
    selectUserInfoQuery,
    selectUserInfoParams
  );
  connection.release();
  return [userInfoRows];
}



//SignIn
async function getuser(id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectUserInfoQuery = `
      select *
      from User
      where id = '${id}'`;

  const [userInfoRows] = await connection.query(
    selectUserInfoQuery
  );
  connection.release();
  return userInfoRows;
}

module.exports = {
  useridCheck,
  userNicknameCheck,
  insertUserInfo,
  selectUserInfo,
  getuser,
  getUserId,
  insertAssetInfo,
  insertBalanceInfo,
  getAssetIdAndBalanceId,
  insertAccount
};
