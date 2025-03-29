// src/App.tsx
import { RecoilRoot } from 'recoil';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import AuthPage from '@/pages/AuthPage';
//import LogoutButton from '@/components/LogoutButton';

export default function App() {
  return (
    <RecoilRoot>
       
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
        </Routes>
      
    </RecoilRoot>
  );
}
