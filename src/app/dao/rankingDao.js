const { pool } = require("../../../config/database");

// index
async function getMyProduct(userId) {
  const connection = await pool.getConnection(async (conn) => conn);

  const selectEmailQuery = `
  select (@rank := @rank + 1) as ranking, Cart.userId, User.nickname, sum(productPrice) as sumPrice
  from Cart
  inner join User on User.userId = Cart.userId, ( SELECT @rank := 0 ) AS b
  where isSuccess = 1 && DATE_FORMAT(now(), '%Y-%m') = DATE_FORMAT(Cart.createAt, '%Y-%m')
  group by userId
  order by sumPrice DESC limit 10
  `;

  const [rows] = await connection.query(selectEmailQuery)
  connection.release();

  return rows;
}

async function getRank() {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectEmailQuery = `
  select (@rank := @rank + 1) as ranking, Cart.userId, User.nickname, sum(productPrice) as sumPrice
  from Cart
  inner join User on User.userId = Cart.userId, ( SELECT @rank := 0 ) AS b
  where isSuccess = 1 && DATE_FORMAT(now(), '%Y-%m') = DATE_FORMAT(Cart.createAt, '%Y-%m')
  group by userId
  order by sumPrice DESC limit 10
  `;
  const [rows] = await connection.query(selectEmailQuery)
  connection.release();
  return rows;
}

  async function getMyRank(userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectRankQuery = `
    select ranking, userId, nickname, sumPrice
    from (select (@rank := @rank + 1) as ranking, Cart.userId, User.nickname, sum(productPrice) as sumPrice
    from Cart
    inner join User on User.userId = Cart.userId, ( SELECT @rank := 0 ) AS b
    where isSuccess = 1 && DATE_FORMAT(now(), '%Y-%m') = DATE_FORMAT(Cart.createAt, '%Y-%m')
    group by userId
    order by sumPrice DESC) as totalRank
    where userId = ${userId}
    `;
    const [rows] = await connection.query(selectRankQuery)
    connection.release();
    return rows;
  }

  async function setMyProduct1(userId, productName, productPrice, productImg) {
    const connection = await pool.getConnection(async (conn) => conn);
    const productQuery = `
          INSERT INTO Cart(userId, productName, productPrice, productImg, isSuccess) VALUES(?, ?, ?, ?, 0);
    `;
  
    const [rows] = await connection.query(productQuery, [userId, productName, productPrice, productImg]);
    connection.release();
  
    return rows;
  }

  async function setMyProduct2(userId, productName, productPrice) {
    const connection = await pool.getConnection(async (conn) => conn);
    const productQuery = `
          INSERT INTO Cart(userId, productName, productPrice, isSuccess) VALUES(?, ?, ?, 0);
    `;
  
    const [rows] = await connection.query(productQuery, [userId, productName, productPrice]);
    connection.release();
  
    return rows;
  }


  async function updateProduct(cartId, userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const productQuery = `
        UPDATE Cart SET status = 0 WHERE cartId = ? AND userId = ${userId};
    `;  
  
    const [rows] = await connection.query(productQuery, cartId);
    connection.release();
  
    return rows;
  }


  async function updateType(type, userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const productQuery = `
        UPDATE User SET chartype = ? WHERE userId = ${userId};
    `;  
  
    const [rows] = await connection.query(productQuery, type);
    connection.release();
  
    return rows;
  }
module.exports = {
  getRank,
  getMyRank,
  getMyProduct,
  setMyProduct1,
  setMyProduct2,
  updateProduct,
  updateType

};
