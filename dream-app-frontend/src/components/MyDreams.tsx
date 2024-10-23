import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyDreams: React.FC = () => {
    const [dreams, setDreams] = useState<any[]>([]);
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        const fetchMyDreams = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/dreams//my?user_id=${userId}`);
                setDreams(response.data);
            } catch (error) {
                console.error('エラーが発生しました', error);
            }
        };
        if (userId) {
            fetchMyDreams();
        }
    }, [userId]);

    return (
        <div>
            <h1>自分の投稿した夢</h1>
            {dreams.length > 0 ? (
                dreams.map(dream => (
                    <div key={dream.id} className="dream-card">
                        <h2>{dream.title}</h2>
                        <p>{dream.content}</p>
                    </div>
                ))
            ) : (
                <p>まだ夢を投稿していません。</p>
            )}
        </div>
    );
};

export default MyDreams;