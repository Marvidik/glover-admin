
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Ban, Unlock, Calendar, AlertTriangle } from 'lucide-react';

const BanManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const bannedUsers = [
    {
      id: '1',
      username: 'mikewilson',
      email: 'mike.wilson@email.com',
      banDate: '2024-03-10',
      banReason: 'Suspicious transaction activity',
      bannedBy: 'Admin John',
      severity: 'High',
      accountType: 'Standard',
      totalTransactions: 45,
      lastActivity: '2024-03-09',
    },
    {
      id: '2',
      username: 'alexjones',
      email: 'alex.jones@email.com',
      banDate: '2024-03-08',
      banReason: 'Failed identity verification multiple times',
      bannedBy: 'Admin Sarah',
      severity: 'Medium',
      accountType: 'Premium',
      totalTransactions: 12,
      lastActivity: '2024-03-07',
    },
    {
      id: '3',
      username: 'tomsmith',
      email: 'tom.smith@email.com',
      banDate: '2024-03-05',
      banReason: 'Policy violation - Multiple account creation',
      bannedBy: 'System Auto',
      severity: 'High',
      accountType: 'Standard',
      totalTransactions: 3,
      lastActivity: '2024-03-04',
    },
  ];

  const filteredUsers = bannedUsers.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.banReason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'High':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />High Risk</Badge>;
      case 'Medium':
        return <Badge variant="outline" className="border-orange-200 text-orange-700">Medium Risk</Badge>;
      case 'Low':
        return <Badge variant="outline" className="border-yellow-200 text-yellow-700">Low Risk</Badge>;
      default:
        return <Badge variant="secondary">{severity}</Badge>;
    }
  };

  const handleUnban = (userId: string, username: string) => {
    console.log('Unbanning user:', userId, username);
    // API call would go here
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ban Management</h1>
          <p className="text-gray-600 mt-1">Manage banned users and review ban reasons</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Total Banned: <span className="font-medium text-red-600">{bannedUsers.length}</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Banned Users</CardTitle>
          <CardDescription>
            Review and manage user bans with ability to unban accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by username, email, or ban reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-medium text-gray-900">User</th>
                  <th className="text-left p-4 font-medium text-gray-900">Ban Date</th>
                  <th className="text-left p-4 font-medium text-gray-900">Reason</th>
                  <th className="text-left p-4 font-medium text-gray-900">Severity</th>
                  <th className="text-left p-4 font-medium text-gray-900">Banned By</th>
                  <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900 flex items-center">
                          <Ban className="w-4 h-4 text-red-500 mr-2" />
                          {user.username}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">
                          {user.accountType} • {user.totalTransactions} transactions
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {user.banDate}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-900 truncate" title={user.banReason}>
                          {user.banReason}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      {getSeverityBadge(user.severity)}
                    </td>
                    <td className="p-4">
                      <span className="text-gray-600">{user.bannedBy}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Ban Details</DialogTitle>
                              <DialogDescription>
                                Complete ban information for {user.username}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Username</Label>
                                  <p className="text-sm text-gray-900">{user.username}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                                  <p className="text-sm text-gray-900">{user.email}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Ban Date</Label>
                                  <p className="text-sm text-gray-900">{user.banDate}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Banned By</Label>
                                  <p className="text-sm text-gray-900">{user.bannedBy}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Account Type</Label>
                                  <p className="text-sm text-gray-900">{user.accountType}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Severity</Label>
                                  <div className="mt-1">{getSeverityBadge(user.severity)}</div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Total Transactions</Label>
                                  <p className="text-sm text-gray-900">{user.totalTransactions}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Last Activity</Label>
                                  <p className="text-sm text-gray-900">{user.lastActivity}</p>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Ban Reason</Label>
                                <p className="text-sm text-gray-900 mt-1">{user.banReason}</p>
                              </div>
                              
                              <div className="pt-4 border-t">
                                <Button 
                                  variant="outline" 
                                  onClick={() => handleUnban(user.id, user.username)}
                                  className="w-full"
                                >
                                  <Unlock className="w-4 h-4 mr-2" />
                                  Unban User
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleUnban(user.id, user.username)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Unlock className="w-4 h-4 mr-1" />
                          Unban
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Ban className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No banned users found matching your search criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BanManagement;
