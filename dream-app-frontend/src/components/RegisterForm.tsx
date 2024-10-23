import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/register', { username, password });
      setMessage('登録が成功しました！ログインしてください。');
    } catch (error) {
      setMessage('登録に失敗しました。');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h1>ユーザー登録</h1>
      <input
        type="text"
        placeholder="ユーザー名"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">登録</button>
      <p>{message}</p>
    </form>
  );
};

export default RegisterForm;
