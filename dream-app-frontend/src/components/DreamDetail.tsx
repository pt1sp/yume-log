import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const DreamDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [dream, setDream] = useState<any>(null);
    const [reaction, setReaction] = useState<string>('');

    useEffect(() => {
        const fetchDreamDetail = async () => {
            const response = await axios.get(`http://localhost:4000/api/dreams/${id}`);
            setDream(response.data);
        };

        fetchDreamDetail();
    }, [id]);

    const handleReaction = async () => {
        if (reaction) {
            await axios.post(`http://localhost:4000/api/dreams/${id}/react`, { reaction });
            // 反応後、再フェッチするか、状態を更新する
            const updatedResponse = await axios.get(`http://localhost:4000/api/dreams/${id}`);
            setDream(updatedResponse.data);
        }
    };

    return (
        <div>
            {dream ? (
                <>
                    <h1>{dream.title}</h1>
                    <p>{dream.content}</p>
                    <p>👍 {dream.reactions.like} 😊 {dream.reactions.happy} 😱 {dream.reactions.scary} 😢 {dream.reactions.sad} 😔 {dream.reactions.lonely} 😄 {dream.reactions.fun} 😲 {dream.reactions.surprised} 👎 {dream.reactions.dislike}</p>
                    <h2>リアクションを追加する</h2>
                    <select value={reaction} onChange={(e) => setReaction(e.target.value)}>
                        <option value="">リアクションを選択</option>
                        <option value="like">👍</option>
                        <option value="happy">😊</option>
                        <option value="scary">😱</option>
                        <option value="sad">😢</option>
                        <option value="lonely">😔</option>
                        <option value="fun">😄</option>
                        <option value="surprised">😲</option>
                        <option value="dislike">👎</option>
                    </select>
                    <button onClick={handleReaction}>送信</button>
                </>
            ) : (
                <p>夢の詳細を読み込んでいます...</p>
            )}
        </div>
    );
};

export default DreamDetail;
