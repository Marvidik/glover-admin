
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Key, Clock, Edit, Trash2, Plus, Shield, RefreshCw } from 'lucide-react';

const OTPManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const otpCodes = [
    {
      id: '1',
      user: 'johnsmith',
      email: 'john.smith@email.com',
      code: '123456',
      generatedAt: '2024-03-15 14:30:00',
      expiresAt: '2024-03-15 14:35:00',
      status: 'Active',
      purpose: 'Login Verification',
    },
    {
      id: '2',
      user: 'sarahjohnson',
      email: 'sarah.j@email.com',
      code: '789012',
      generatedAt: '2024-03-15 14:25:00',
      expiresAt: '2024-03-15 14:30:00',
      status: 'Expired',
      purpose: 'Transaction Confirmation',
    },
    {
      id: '3',
      user: 'emilydavis',
      email: 'emily.davis@email.com',
      code: '345678',
      generatedAt: '2024-03-15 14:20:00',
      expiresAt: '2024-03-15 14:25:00',
      status: 'Used',
      purpose: 'Password Reset',
    },
  ];

  const bankCodes = [
    {
      id: '1',
      codeName: 'TRANSFER_LIMIT_DAILY',
      codeValue: '50000',
      description: 'Daily transfer limit for standard accounts',
      category: 'Transfer Limits',
      lastModified: '2024-03-10',
      modifiedBy: 'Admin John',
    },
    {
      id: '2',
      codeName: 'OTP_EXPIRY_MINUTES',
      codeValue: '5',
      description: 'OTP expiration time in minutes',
      category: 'Security',
      lastModified: '2024-03-08',
      modifiedBy: 'Admin Sarah',
    },
    {
      id: '3',
      codeName: 'MAX_LOGIN_ATTEMPTS',
      codeValue: '3',
      description: 'Maximum failed login attempts before account lock',
      category: 'Security',
      lastModified: '2024-03-05',
      modifiedBy: 'Admin Mike',
    },
    {
      id: '4',
      codeName: 'PREMIUM_TRANSFER_LIMIT',
      codeValue: '100000',
      description: 'Daily transfer limit for premium accounts',
      category: 'Transfer Limits',
      lastModified: '2024-03-01',
      modifiedBy: 'Admin John',
    },
  ];

  const filteredOTPs = otpCodes.filter(otp => 
    otp.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    otp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    otp.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCodes = bankCodes.filter(code => 
    code.codeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge variant="outline" className="border-green-200 text-green-700"><Clock className="w-3 h-3 mr-1" />Active</Badge>;
      case 'Expired':
        return <Badge variant="outline" className="border-orange-200 text-orange-700">Expired</Badge>;
      case 'Used':
        return <Badge variant="outline" className="border-gray-200 text-gray-700">Used</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleGenerateOTP = (userId: string) => {
    console.log('Generating new OTP for user:', userId);
    // API call would go here
  };

  const handleEditCode = (codeId: string) => {
    setIsEditing(codeId);
  };

  const handleSaveCode = (codeId: string) => {
    console.log('Saving code:', codeId);
    setIsEditing(null);
    // API call would go here
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security & OTP Management</h1>
          <p className="text-gray-600 mt-1">Manage OTP codes and system configuration</p>
        </div>
      </div>

      <Tabs defaultValue="otps" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="otps">OTP Codes</TabsTrigger>
          <TabsTrigger value="bank-codes">Bank Codes</TabsTrigger>
        </TabsList>

        <TabsContent value="otps">
          <Card>
            <CardHeader>
              <CardTitle>OTP Management</CardTitle>
              <CardDescription>
                Monitor and manage one-time passwords for user authentication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by user, email, or purpose..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Generate OTP
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-4 font-medium text-gray-900">User</th>
                      <th className="text-left p-4 font-medium text-gray-900">OTP Code</th>
                      <th className="text-left p-4 font-medium text-gray-900">Purpose</th>
                      <th className="text-left p-4 font-medium text-gray-900">Status</th>
                      <th className="text-left p-4 font-medium text-gray-900">Expires At</th>
                      <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOTPs.map((otp) => (
                      <tr key={otp.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-gray-900">{otp.user}</div>
                            <div className="text-sm text-gray-500">{otp.email}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Key className="w-4 h-4 text-blue-500" />
                            <span className="font-mono text-lg font-bold text-blue-600">{otp.code}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-900">{otp.purpose}</span>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(otp.status)}
                        </td>
                        <td className="p-4">
                          <span className="text-gray-600">{otp.expiresAt}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleGenerateOTP(otp.id)}
                            >
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredOTPs.length === 0 && (
                <div className="text-center py-8">
                  <Key className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No OTP codes found matching your search criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bank-codes">
          <Card>
            <CardHeader>
              <CardTitle>Bank Configuration Codes</CardTitle>
              <CardDescription>
                System configuration values and limits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by code name, description, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Code
                </Button>
              </div>

              <div className="grid gap-4">
                {filteredCodes.map((code) => (
                  <Card key={code.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <Shield className="w-5 h-5 text-blue-500" />
                          <div>
                            <h3 className="font-medium text-gray-900">{code.codeName}</h3>
                            <p className="text-sm text-gray-600">{code.description}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>Category: {code.category}</span>
                          <span>Modified: {code.lastModified}</span>
                          <span>By: {code.modifiedBy}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {isEditing === code.id ? (
                          <div className="flex items-center space-x-2">
                            <Input 
                              value={code.codeValue} 
                              className="w-24"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSaveCode(code.id)}
                            >
                              Save
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setIsEditing(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="font-mono text-lg px-3 py-1">
                              {code.codeValue}
                            </Badge>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditCode(code.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {filteredCodes.length === 0 && (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No configuration codes found matching your search criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OTPManagement;
