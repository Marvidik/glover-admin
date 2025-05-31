
import { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardHome from '@/components/dashboard/DashboardHome';
import UserManagement from '@/components/users/UserManagement';
import UserProfile from '@/components/users/UserProfile';
import TransactionManagement from '@/components/transactions/TransactionManagement';
import CreateTransaction from '@/components/transactions/CreateTransaction';
import PinCodeManagement from '@/components/security/PinCodeManagement';

export type PageType = 'dashboard' | 'users' | 'profile' | 'transactions' | 'create-transaction' | 'pincodes';

const DashboardLayout = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        return <TransactionManagement onCreateTransaction={() => setCurrentPage('create-transaction')} />;
      case 'create-transaction':
        return <CreateTransaction onBack={() => setCurrentPage('transactions')} />;
      case 'pincodes':
        return <PinCodeManagement />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={(page) => {
          setCurrentPage(page);
          setSidebarOpen(false); // Close mobile sidebar when navigating
        }}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className="flex-1 overflow-y-auto w-full min-w-0">
        {renderPage()}
      </main>
    </div>
  );
};

export default DashboardLayout;
