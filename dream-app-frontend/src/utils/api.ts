import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

export const fetchDreams = async () => {
  const response = await axios.get(`${API_URL}/dreams`);
  return response.data;
};

export const postDream = async (dream: { content: string; tag: string; location?: string }) => {
  const response = await axios.post(`${API_URL}/dreams`, dream);
  return response.data;
};

export const postReaction = async (reaction: { dream_id: number; reaction_type: string }) => {
  const response = await axios.post(`${API_URL}/reactions`, reaction);
  return response.data;
};
