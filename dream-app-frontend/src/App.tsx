import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DreamForm from './components/DreamForm';
import Header from './components/Header';
import RecommendedDreams from './components/RecommendedDreams';
import DreamDisplay from './components/DreamDisplay';
import DreamDetail from './components/DreamDetail';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import MyDreams from './components/MyDreams';

const App: React.FC = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dream/:id" element={<DreamDetail />} />
        <Route path="/" element={<RecommendedDreams />} />
        <Route path="/record" element={<DreamForm />} />
        <Route path="/display" element={<DreamDisplay />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/my-dreams" element={<MyDreams />} /> 
      </Routes>
    </div>
  );
};

export default App;
