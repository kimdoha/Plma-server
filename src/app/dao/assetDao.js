const { pool } = require("../../../config/database");

// index
async function patchBudget(assetId, asset) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectEmailQuery = `
  update Asset
  SET asset = ${asset}
  WHERE assetId = ${assetId}`;

  const [rows] = await connection.query(selectEmailQuery)
  connection.release();

  return rows;
}

// 이번달 유저 가용자산 인덱스 찾기
async function getassetId(userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectEmailQuery = `
  select *
  from Asset
  WHERE userId = ${userId} && DATE_FORMAT(now(), '%Y-%m') = DATE_FORMAT(createAt, '%Y-%m')`;

  const [rows] = await connection.query(selectEmailQuery)
  connection.release();

  return rows;
}

// 월별 소비 패턴 불러오기
async function getassetg(userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectEmailQuery = `
  select money, DATE_FORMAT(createAt, '%Y-%m-%d') as day
  from Account
  where userId = ${userId} && DATE_FORMAT(now(), '%Y-%m') = DATE_FORMAT(createAt, '%Y-%m')`;

  const [rows] = await connection.query(selectEmailQuery)
  connection.release();

  return rows;
}

module.exports = {
  patchBudget,
  getassetId,
  getassetg
};
