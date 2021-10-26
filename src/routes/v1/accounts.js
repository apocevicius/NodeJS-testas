const express = require('express');
const { dbAction, dbFail, dbSuccess } = require('../../utils/dbHelper');
// const { authenticateToken } = require('../../utils/middleware');


const router = express.Router();
// POST /accounts/
// add correct userID
router.post('/accounts', async (req, res) => {
  // after validation
  const sql = 'INSERT INTO accounts (id, group_id, user_id) VALUES (?, ?, ?)';
  const { id, group_id, user_id } = req.body;
  const dbResult = await dbAction(sql, [id, group_id, user_id]);
  if (dbResult === false) {
    return res.status(500).json({ error: 'sideways' });
  }
  res.json({ msg: 'post created', dbResult });
});

// GET /posts/all - list all post from everyone, join user email
router.get('/accounts', async (req, res) => {
  const sql = `
  SELECT accounts.id, accounts.group_id, accounts.user_id, AS user
  FROM accounts
  INNER JOIN users
  ON users.userId = posts.userId`;
  const dbResult = await dbAction(sql);
  if (dbResult === false) return dbFail(res);
  dbSuccess(res, dbResult);
});



module.exports = router;