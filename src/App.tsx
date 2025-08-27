import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ParentDashboard from './pages/ParentDashboard';
import KidDashboard from './pages/KidDashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/parent" element={<ParentDashboard />} />
      <Route path="/kid/:kidId" element={<KidDashboard />} />
    </Routes>
  );
}
