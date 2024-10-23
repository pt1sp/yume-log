import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dream } from '../types';
import { useNavigate } from 'react-router-dom';

const RecommendedDreams: React.FC = () => {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const Navigate = useNavigate();

  useEffect(() => {
    const fetchDreams = async () => {
      const response = await axios.get('http://localhost:4000/api/dreams/recommended');
      setDreams(response.data);
    };

    fetchDreams();
  }, []);

  return (
    <div className="recommended-dreams">
      <button onClick={() => Navigate('/my-dreams')}>自分の夢を表示</button>
    </div>
  );
};





export default RecommendedDreams;
