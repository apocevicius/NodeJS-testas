const express = require('express')
const { dbAction, dbFail, dbSuccess } = require('../../utils/dbHelper')
const { hashValue, verifyHash } = require('../../utils/hash')
const { validateRegister } = require('../../utils/validate')
const jwt = require('jsonwebtoken')
// const { jwtSecret } = require('../../config')

const mysql = require('mysql2/promise');
const dbConfig = require('../../config');

const router = express.Router()



// POST /user/register 
router.post('/register', async (req, res) => {
    const { body } = req;
  
    const validateResult = await validateRegister(body, res);
    if (validateResult === false) return;
    
    try {
      const conn = await mysql.createConnection(dbConfig);
      const sql = `
      INSERT INTO users (email, password)
      VALUES ( ?, ? )
      `;
      
      const result = await conn.execute(sql, [
        body.email,
        hashValue(body.password),
      ]);
      res.send({ msg: 'user created', result });
      await conn.end();
    } catch (error) {
      console.log('Error Registering', error.message);
      res.status(500).send({ error: 'Something Went Wrong' });
    }
  });

// POST user/login
router.post('/login', validateRegister, async (req, res) => {
  const sql = 'SELECT * FROM users WHERE email = ?'
  const dbResult = await dbAction(sql, [req.body.email])

if (dbResult.length !== 1) {
  return dbFail( res, 'email does not exist', 400)
}
  
  if (!verifyHash(req.body.password, dbResult[0].password)) {
  return dbFail(res, 'passwords not match');
  }
 
  const token = jwt.sign({ email: req.body.email }, jwtSecret, { expiresIn: '1h' })
  console.log('token', token);
  const loggedInUser = {
    email: req.body.email,
    token: token,
  };
  dbSuccess(res, loggedInUser);
});



module.exports = router;