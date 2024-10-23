import { useState } from 'react';
import axios from 'axios';

const DreamForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const userId = localStorage.getItem('user_id') || '0';

    try {
      await axios.post('http://localhost:4000/api/dreams', {
        user_id: userId,
        title,
        content,
        tag,
        location,
      });
      alert('夢が投稿されました~!');

      const response = await axios.get('http://localhost:4000/api/dreams/display');
      console.log(response.data);
      setTitle('');
      setContent('');
      setTag('');
      setLocation('');
    } catch (error) {
      console.error('エラーが発生しました', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="dream-form">
      <input
        type="text"
        placeholder="タイトルを入力してください"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="夢の内容を入力してください"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="タグ"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
      />
      <input
        type="text"
        placeholder="場所（任意）"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button type="submit">投稿</button>
    </form>
  );
};

export default DreamForm;
