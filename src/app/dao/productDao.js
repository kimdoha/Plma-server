const { pool } = require("../../../config/database");

// index
async function getproducts(userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectEmailQuery = `
  select cartId, productImg, productName, productPrice, round(productPrice / a.asset * 100, 1) as percent
  from Cart
  inner join (select userId, asset from Asset) a on a.userId = Cart.userId
  where Cart.userId = ${userId} && status = 1
  `;
  const [rows] = await connection.query(selectEmailQuery)
  connection.release();

  return rows;
}

async function patchproducts(cartId, isSuccess) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectRankQuery = `
  update Cart
  SET isSuccess = ${isSuccess}
  WHERE cartId = ${cartId};
  `;

  const [rows] = await connection.query(selectRankQuery)
  connection.release();

  return rows;
}

async function getproductPrice(cartId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectRankQuery = `
  select productPrice
  from Cart
  where cartId = ${cartId};
  `;

  const [rows] = await connection.query(selectRankQuery)
  connection.release();

  return rows;
}

async function postPAcount(userId, assetId, money) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectRankQuery = `
  INSERT INTO Account(userId, assetId, money) VALUES (${userId}, ${assetId}, ${money});
  `;

  const [rows] = await connection.query(selectRankQuery)
  connection.release();

  return rows;
}

async function postMAcount(userId, assetId, money) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectRankQuery = `
  INSERT INTO Account(userId, assetId, money) VALUES (${userId}, ${assetId}, -${money});
  `;

  const [rows] = await connection.query(selectRankQuery)
  connection.release();

  return rows;
}

module.exports = {
  getproducts,
  patchproducts,
  getproductPrice,
  postPAcount,
  postMAcount
};
