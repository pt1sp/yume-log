import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <header>
      <h1>ゆめログ!!</h1>
      <nav>
        <Link to="/record">夢を記録する</Link>
        <Link to="/my-dreams">記録した夢</Link>
        <Link to="/display">他の人の夢を見る</Link>
        {username ? ( // ユーザー名が存在する場合
                <div>
                    <span>{username} </span>
                    <button onClick={handleLogout}>ログアウト</button>
                </div>
            ) : ( // ユーザー名が存在しない場合
                <button onClick={() => navigate('/login')}>ログイン</button>
            )}
      </nav>
    </header>
  );
};

export default Header;
