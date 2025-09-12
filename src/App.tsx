import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/Login';
import ParentDashboard from '@/pages/ParentDashboard';
import KidDashboard from '@/pages/KidDashboard';
import ActivitiesBrowser from '@/pages/ActivitiesBrowser';
import FamilySettings from '@/pages/FamilySettings';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/google/callback" element={<Login />} />
      <Route path="/parent" element={<ParentDashboard />} />
      <Route path="/kid/:kidId" element={<KidDashboard />} />
      <Route path="/activities" element={<ActivitiesBrowser />} />
      <Route path="/settings" element={<FamilySettings />} />
    </Routes>
  );
}
