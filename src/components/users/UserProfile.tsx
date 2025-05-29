
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, CheckCircle, Ban, Edit, Save, X } from 'lucide-react';

interface UserProfileProps {
  userId: string | null;
  onBack: () => void;
}

const UserProfile = ({ userId, onBack }: UserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);

  // Mock user data
  const user = {
    id: userId,
    username: 'johnsmith',
    email: 'john.smith@email.com',
    firstName: 'John',
    lastName: 'Smith',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    address: '123 Main St, New York, NY 10001',
    accountType: 'Premium',
    verified: true,
    banned: false,
    balance: '$12,450.00',
    joinDate: '2024-01-15',
    lastLogin: '2024-03-15 14:30:00',
    securityQuestions: [
      { question: 'What is your mother\'s maiden name?', answer: '••••••••' },
      { question: 'What was your first pet\'s name?', answer: '••••••••' },
    ],
    transactionPin: '••••',
  };

  const transactions = [
    { id: 1, date: '2024-03-15', type: 'Transfer', amount: '-$500.00', status: 'Completed', recipient: 'Sarah Johnson' },
    { id: 2, date: '2024-03-14', type: 'Deposit', amount: '+$2,000.00', status: 'Completed', recipient: 'Direct Deposit' },
    { id: 3, date: '2024-03-13', type: 'Transfer', amount: '-$150.00', status: 'Pending', recipient: 'Mike Wilson' },
  ];

  if (!userId) {
    return (
      <div className="p-6">
        <p className="text-gray-500">No user selected</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Users
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
          <p className="text-gray-600 mt-1">Manage user details and permissions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profile Summary</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-600">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-gray-500">@{user.username}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <div className="flex space-x-2">
                    {user.verified ? (
                      <Badge variant="outline" className="border-green-200 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-orange-200 text-orange-700">
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
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Account Type:</span>
                  <Badge variant={user.accountType === 'Premium' ? 'default' : 'secondary'}>
                    {user.accountType}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Balance:</span>
                  <span className="font-medium text-gray-900">{user.balance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Join Date:</span>
                  <span className="text-gray-900">{user.joinDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Login:</span>
                  <span className="text-gray-900">{user.lastLogin}</span>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button 
                  variant={user.verified ? "outline" : "default"} 
                  size="sm" 
                  className="flex-1"
                >
                  {user.verified ? 'Unverify' : 'Verify'}
                </Button>
                <Button 
                  variant={user.banned ? "outline" : "destructive"} 
                  size="sm" 
                  className="flex-1"
                >
                  {user.banned ? 'Unban' : 'Ban'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="personal" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="account">Account Info</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>User's personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        value={user.firstName} 
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        value={user.lastName} 
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        value={user.email} 
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={user.phone} 
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input 
                        id="dob" 
                        type="date" 
                        value={user.dateOfBirth} 
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      value={user.address} 
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Account settings and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        value={user.username} 
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountType">Account Type</Label>
                      <Input 
                        id="accountType" 
                        value={user.accountType} 
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="balance">Current Balance</Label>
                      <Input 
                        id="balance" 
                        value={user.balance} 
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="joinDate">Join Date</Label>
                      <Input 
                        id="joinDate" 
                        value={user.joinDate} 
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>Recent transaction activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left p-3 font-medium text-gray-900">Date</th>
                          <th className="text-left p-3 font-medium text-gray-900">Type</th>
                          <th className="text-left p-3 font-medium text-gray-900">Amount</th>
                          <th className="text-left p-3 font-medium text-gray-900">Status</th>
                          <th className="text-left p-3 font-medium text-gray-900">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((tx) => (
                          <tr key={tx.id} className="border-b border-gray-100">
                            <td className="p-3 text-gray-900">{tx.date}</td>
                            <td className="p-3 text-gray-900">{tx.type}</td>
                            <td className={`p-3 font-medium ${
                              tx.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {tx.amount}
                            </td>
                            <td className="p-3">
                              <Badge variant={tx.status === 'Completed' ? 'default' : 'secondary'}>
                                {tx.status}
                              </Badge>
                            </td>
                            <td className="p-3 text-gray-600">{tx.recipient}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Information</CardTitle>
                  <CardDescription>Security questions and transaction PIN</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Security Questions</h4>
                    <div className="space-y-4">
                      {user.securityQuestions.map((sq, index) => (
                        <div key={index} className="space-y-2">
                          <Label>{sq.question}</Label>
                          <Input value={sq.answer} readOnly className="bg-gray-50" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Transaction PIN</h4>
                    <div className="space-y-2">
                      <Label htmlFor="transactionPin">Current PIN</Label>
                      <div className="flex space-x-4">
                        <Input 
                          id="transactionPin" 
                          value={user.transactionPin} 
                          readOnly 
                          className="bg-gray-50 max-w-32"
                        />
                        <Button variant="outline" size="sm">Reset PIN</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
