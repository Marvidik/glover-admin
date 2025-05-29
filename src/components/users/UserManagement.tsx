
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Eye, Ban, CheckCircle, XCircle } from 'lucide-react';

interface UserManagementProps {
  onUserSelect: (userId: string) => void;
}

const UserManagement = ({ onUserSelect }: UserManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Mock user data
  const users = [
    {
      id: '1',
      username: 'johnsmith',
      email: 'john.smith@email.com',
      accountType: 'Premium',
      verified: true,
      banned: false,
      balance: '$12,450.00',
      joinDate: '2024-01-15',
    },
    {
      id: '2',
      username: 'sarahjohnson',
      email: 'sarah.j@email.com',
      accountType: 'Standard',
      verified: false,
      banned: false,
      balance: '$3,200.00',
      joinDate: '2024-02-20',
    },
    {
      id: '3',
      username: 'mikewilson',
      email: 'mike.wilson@email.com',
      accountType: 'Standard',
      verified: true,
      banned: true,
      balance: '$0.00',
      joinDate: '2024-01-30',
    },
    {
      id: '4',
      username: 'emilydavis',
      email: 'emily.davis@email.com',
      accountType: 'Premium',
      verified: true,
      banned: false,
      balance: '$8,750.00',
      joinDate: '2024-03-10',
    },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'verified') return matchesSearch && user.verified;
    if (filter === 'unverified') return matchesSearch && !user.verified;
    if (filter === 'banned') return matchesSearch && user.banned;
    return matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
          <CardDescription>
            Search, filter, and manage user accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by username or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="verified">Verified Only</SelectItem>
                <SelectItem value="unverified">Unverified Only</SelectItem>
                <SelectItem value="banned">Banned Users</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-medium text-gray-900">User</th>
                  <th className="text-left p-4 font-medium text-gray-900">Account Type</th>
                  <th className="text-left p-4 font-medium text-gray-900">Status</th>
                  <th className="text-left p-4 font-medium text-gray-900">Balance</th>
                  <th className="text-left p-4 font-medium text-gray-900">Join Date</th>
                  <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={user.accountType === 'Premium' ? 'default' : 'secondary'}>
                        {user.accountType}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        {user.verified ? (
                          <Badge variant="outline" className="border-green-200 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-orange-200 text-orange-700">
                            <XCircle className="w-3 h-3 mr-1" />
                            Unverified
                          </Badge>
                        )}
                        {user.banned && (
                          <Badge variant="destructive">
                            <Ban className="w-3 h-3 mr-1" />
                            Banned
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-gray-900">{user.balance}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-600">{user.joinDate}</span>
                    </td>
                    <td className="p-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUserSelect(user.id)}
                        className="flex items-center space-x-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No users found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
