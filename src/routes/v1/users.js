const express = require('express')
const { dbAction, dbFail, dbSuccess } = require('../../utils/dbHelper')
const { hashValue, verifyHash } = require('../../utils/hash')
const { validateRegister } = require('../../utils/validate')
const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../../config')



const router = express.Router()

//POST /register
router.post('/register', validateRegister, async (req, res) => {
    const newUser = {
        email: req.body.email,
        password: hashValue(req.body.password),
    };
    const sql = `
    INSERT INTO users (email, password)
    VALUES (?, ?)
    `;
    const dbResult = await dbAction(sql, [newUser.email, newUser.password])
    if (dbResult === false) {
        return res.status(500).json({ error: 'Smething Wrong' })
    }
    if (dbResult.affectedRows === 1) {
        return res.status(500).json({ error: 'Something Wrong' })
    }
    console.log('No Rows Affected');
    res.status(500).json({ error: 'Something Wrong' })
});

//POST /login
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