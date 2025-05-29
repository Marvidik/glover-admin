
import { useState } from 'react';
import LoginPage from '@/components/auth/LoginPage';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return <DashboardLayout />;
};

export default Index;
