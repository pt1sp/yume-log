const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 4000;

// サーバーを開始
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// CORSの設定を追加
app.use(cors({
  origin: 'http://localhost:3000'
}));

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dreams_db',
});

app.use(express.json());

// 夢の投稿
app.post('/api/dreams', async (req, res) => {
  const { user_id, title, content, tag, location } = req.body;
  try {
    const [result] = await db.query('INSERT INTO dreams (user_id, title, content, tag, location) VALUES (?, ?, ?, ?, ?)', [user_id, title, content, tag, location]);
    res.status(201).json({ message: '夢が投稿されました！', id: result.insertId });
  } catch (error) {
    console.error('エラー:', error);
    res.status(500).json({ error: 'サーバーエラー' });
  }
});

// 夢のリアクション追加
app.post('/api/reactions', async (req, res) => {
  const { dream_id, reaction_type } = req.body;
  const sql = 'INSERT INTO reactions (dream_id, reaction_type) VALUES (?, ?)';
  try {
    const [result] = await db.query(sql, [dream_id, reaction_type]);
    res.status(201).json({ message: 'リアクションが追加されました', id: result.insertId });
  } catch (error) {
    console.error('エラー:', error);
    res.status(500).json({ error: 'サーバーエラー' });
  }
  console.log(dreams);
});

// おすすめの夢を取得する
app.get('/api/dreams/recommended', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM dreams ORDER BY RAND() LIMIT 5');
    res.json(rows);
  } catch (error) {
    console.error('エラー:', error);
    res.status(500).json({ error: 'サーバーエラー' });
  }
});

// 夢の取得
app.get('/api/dreams/display', async (req, res) => {
  try {
    const [dreams] = await db.query(`
      SELECT d.id, d.title, d.content, d.tag, d.location, d.view_count,
             SUM(CASE WHEN r.reaction_type = 'like' THEN 1 ELSE 0 END) AS like_count,
             SUM(CASE WHEN r.reaction_type = 'happy' THEN 1 ELSE 0 END) AS happy_count,
             SUM(CASE WHEN r.reaction_type = 'scary' THEN 1 ELSE 0 END) AS scary_count,
             SUM(CASE WHEN r.reaction_type = 'sad' THEN 1 ELSE 0 END) AS sad_count,
             SUM(CASE WHEN r.reaction_type = 'lonely' THEN 1 ELSE 0 END) AS lonely_count,
             SUM(CASE WHEN r.reaction_type = 'fun' THEN 1 ELSE 0 END) AS fun_count,
             SUM(CASE WHEN r.reaction_type = 'surprised' THEN 1 ELSE 0 END) AS surprised_count,
             SUM(CASE WHEN r.reaction_type = 'dislike' THEN 1 ELSE 0 END) AS dislike_count
      FROM dreams d
      LEFT JOIN reactions r ON d.id = r.dream_id
      GROUP BY d.id
    `);

    res.json(dreams);
  } catch (error) {
    console.error('エラー:', error);
    res.status(500).send('エラーが発生しました');
  }
});

// 夢の詳細取得
// app.get('/api/dreams/:id', (req, res) => {
//   const dreamId = req.params.id;

//   const query = 'SELECT * FROM dreams WHERE id = 1';
//   connection.query(query, [dreamId], (error, results) => {
//       if (error) {
//           return res.status(500).json({ error: 'データベースエラー' });
//       }
//       if (results.length > 0) {
//           res.json(results[0]);
//       } else {
//           res.status(404).json({ error: '夢が見つかりません' });
//       }
//   });
// });

app.get('/api/dreams/', async (req, res) => {
  const { dreamId } = req.query;
  try {
      const [rows] = await db.query('SELECT * FROM dreams WHERE id = ?', [dreamId]);
      res.json(rows);
  } catch (error) {
      console.error('エラー:', error);
      res.status(500).json({ error: 'サーバーエラー' });
  }
});

// 自分の夢を取得する
app.get('/api/dreams/my', async (req, res) => {
  const { user_id } = req.query;
  try {
      const [rows] = await db.query('SELECT * FROM dreams WHERE user_id = ?', [user_id]);
      res.json(rows);
  } catch (error) {
      console.error('エラー:', error);
      res.status(500).json({ error: 'サーバーエラー' });
  }
});

// リアクション追加
app.post('/api/dreams/:id/react', (req, res) => {
  const dreamId = req.params.id;
  const { reaction } = req.body; // 反応をリクエストボディから取得

  // 各リアクションのカウントを更新
  const updateQuery = `UPDATE dreams SET ${reaction}_count = ${reaction}_count + 1 WHERE id = ?`;
  connection.query(updateQuery, [dreamId], (error, results) => {
      if (error) {
          return res.status(500).json({ error: 'データベースエラー' });
      }
      res.status(204).send(); // 成功を示す204 No Content
  });
});

// ホームルート
app.get('/', (req, res) => {
  console.log('APIに接続されました');
  res.send('ゆめログ API');
});

// ユーザー登録
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );
    res.status(201).json({ message: 'ユーザー登録が完了しました', userId: result.insertId });
  } catch (error) {
    console.error('エラー:', error);
    res.status(400).json({ message: '登録に失敗しました。ユーザー名が重複しています。' });
  }
});

// ログイン
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
      const [user] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
      
      // ユーザーが存在するか確認
      if (user && await bcrypt.compare(password, user.password)) {
          const token = generateToken(user.id); // トークン生成
          res.json({ token, user_id: user.id }); // ユーザーIDをレスポンスに追加
      } else {
          res.status(401).json({ error: 'ユーザー名またはパスワードが間違っています' });
      }
  } catch (error) {
      console.error('エラー:', error);
      res.status(500).json({ error: 'サーバーエラー' });
  }
});



