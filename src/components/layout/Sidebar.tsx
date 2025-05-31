
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Settings,
  LogOut,
  Building,
  Menu,
  X
} from 'lucide-react';
import { PageType } from './DashboardLayout';
import { apiService } from '@/services/api';

interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

const Sidebar = ({ currentPage, onPageChange, isOpen = false, onToggle }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard' as PageType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users' as PageType, label: 'User Management', icon: Users },
    { id: 'transactions' as PageType, label: 'Transactions', icon: CreditCard },
    { id: 'pincodes' as PageType, label: 'PIN & Codes', icon: Settings },
  ];

  const handleLogout = () => {
    apiService.logout();
    window.location.reload();
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-md"
        onClick={onToggle}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate">SecureBank</h1>
              <p className="text-xs md:text-sm text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 md:p-4 overflow-y-auto">
          <div className="space-y-1 md:space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start space-x-2 md:space-x-3 h-10 md:h-auto text-sm md:text-base px-3 md:px-4',
                  currentPage === item.id 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                )}
                onClick={() => onPageChange(item.id)}
              >
                <item.icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Button>
            ))}
          </div>
        </nav>

        <div className="p-3 md:p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start space-x-2 md:space-x-3 text-red-600 hover:bg-red-50 hover:text-red-700 h-10 md:h-auto text-sm md:text-base px-3 md:px-4"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
