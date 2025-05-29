
import { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardHome from '@/components/dashboard/DashboardHome';
import UserManagement from '@/components/users/UserManagement';
import UserProfile from '@/components/users/UserProfile';
import TransactionManagement from '@/components/transactions/TransactionManagement';
import BanManagement from '@/components/bans/BanManagement';
import OTPManagement from '@/components/security/OTPManagement';

export type PageType = 'dashboard' | 'users' | 'profile' | 'transactions' | 'bans' | 'security' | 'otps';

const DashboardLayout = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardHome />;
      case 'users':
        return <UserManagement onUserSelect={(id) => {
          setSelectedUserId(id);
          setCurrentPage('profile');
        }} />;
      case 'profile':
        return <UserProfile userId={selectedUserId} onBack={() => setCurrentPage('users')} />;
      case 'transactions':
        return <TransactionManagement />;
      case 'bans':
        return <BanManagement />;
      case 'otps':
        return <OTPManagement />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
};

export default DashboardLayout;
