import React from 'react';
import axios from 'axios';

const ReactionButtons: React.FC<{ dreamId: number }> = ({ dreamId }) => {
  const handleReaction = async (reaction: string) => {
    try {
      await axios.post('http://localhost:4000/api/reactions', {
        dream_id: dreamId,
        reaction_type: reaction,
      });
      alert(`リアクション: ${reaction} が追加されました`);
    } catch (error) {
      console.error('リアクションの追加に失敗しました', error);
    }
  };

  return (
    <div className="reaction-buttons">
      <button onClick={() => handleReaction('いいね')}>👍 いいね</button>
      <button onClick={() => handleReaction('怖い')}>😱 怖い</button>
      <button onClick={() => handleReaction('悲しい')}>😢 悲しい</button>
    </div>
  );
};

export default ReactionButtons;
