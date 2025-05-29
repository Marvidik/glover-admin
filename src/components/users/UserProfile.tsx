
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, CheckCircle, Ban, Edit, Save, Shield } from 'lucide-react';
import { apiService, UserProfile as UserProfileType } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface UserProfileProps {
  userId: string | null;
  onBack: () => void;
}

const UserProfile = ({ userId, onBack }: UserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBanning, setIsBanning] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const data = await apiService.getUserProfile(Number(userId));
      console.log('User profile data:', data);
      setUserProfile(data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBanUser = async (ban: boolean) => {
    if (!userId) return;
    
    try {
      setIsBanning(true);
      await apiService.banUser(Number(userId), ban);
      toast({
        title: "Success",
        description: `User ${ban ? 'banned' : 'unbanned'} successfully`,
      });
      // Refresh user profile to get updated data
      fetchUserProfile();
    } catch (error) {
      console.error('Failed to update ban status:', error);
      toast({
        title: "Error",
        description: `Failed to ${ban ? 'ban' : 'unban'} user`,
        variant: "destructive",
      });
    } finally {
      setIsBanning(false);
    }
  };

  const handleVerifyUser = async () => {
    if (!userId) return;
    
    try {
      setIsVerifying(true);
      await apiService.verifyUser(Number(userId));
      toast({
        title: "Success",
        description: "User verified successfully",
      });
      // Refresh user profile to get updated data
      fetchUserProfile();
    } catch (error) {
      console.error('Failed to verify user:', error);
      toast({
        title: "Error",
        description: "Failed to verify user",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  if (!userId) {
    return (
      <div className="p-6">
        <p className="text-gray-500">No user selected</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
            <p className="text-gray-600 mt-1">Loading...</p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="p-6">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  const { user, profile, security_answers, transaction_pin, otp, transactions } = userProfile;
  
  // Check if user is banned based on status
  const isBanned = profile.status === 'Banned';

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
                    {profile.first_name[0]}{profile.last_name[0]}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {profile.first_name} {profile.last_name}
                </h3>
                <p className="text-gray-500">@{user.username}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <div className="flex space-x-2">
                    {profile.verified ? (
                      <Badge variant="outline" className="border-green-200 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-orange-200 text-orange-700">
                        Unverified
                      </Badge>
                    )}
                    {isBanned && (
                      <Badge variant="destructive">
                        <Ban className="w-3 h-3 mr-1" />
                        Banned
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Account Type:</span>
                  <Badge variant={profile.account_type === 'Premium' ? 'default' : 'secondary'}>
                    {profile.account_type}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Balance:</span>
                  <span className="font-medium text-gray-900">${profile.balance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pending Balance:</span>
                  <span className="font-medium text-gray-900">${profile.pending_balance}</span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                {!profile.verified && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-green-200 text-green-700 hover:bg-green-50"
                    onClick={handleVerifyUser}
                    disabled={isVerifying}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    {isVerifying ? 'Verifying...' : 'Verify User'}
                  </Button>
                )}
                <Button 
                  variant={isBanned ? "outline" : "destructive"} 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleBanUser(!isBanned)}
                  disabled={isBanning}
                >
                  {isBanning ? 'Processing...' : (isBanned ? 'Unban User' : 'Ban User')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="personal" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
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
                      <Label htmlFor="title">Title</Label>
                      <Input 
                        id="title" 
                        value={profile.title} 
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        value={profile.first_name} 
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input 
                        id="middleName" 
                        value={profile.middle_name} 
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        value={profile.last_name} 
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        value={profile.email} 
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={profile.phone_number} 
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input 
                        id="dob" 
                        type="date" 
                        value={profile.date_of_birth} 
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input 
                        id="occupation" 
                        value={profile.occupation} 
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ssn">SSN</Label>
                      <Input 
                        id="ssn" 
                        value={profile.ssn} 
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idType">ID Type</Label>
                      <Input 
                        id="idType" 
                        value={profile.id_type} 
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idNumber">ID Number</Label>
                      <Input 
                        id="idNumber" 
                        value={profile.id_number} 
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input 
                        id="accountNumber" 
                        value={profile.account_number} 
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input 
                      id="address" 
                      value={profile.street_address} 
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city" 
                        value={profile.city} 
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input 
                        id="state" 
                        value={profile.state} 
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input 
                        id="zipCode" 
                        value={profile.zip_code} 
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
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
                        {transactions.map((tx, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="p-3 text-gray-900">{tx.Date}</td>
                            <td className="p-3 text-gray-900">{tx.Type}</td>
                            <td className="p-3 font-medium text-green-600">
                              ${tx.Amount}
                            </td>
                            <td className="p-3">
                              <Badge variant={tx.Status === 'APPROVED' ? 'default' : 'secondary'}>
                                {tx.Status}
                              </Badge>
                            </td>
                            <td className="p-3 text-gray-600">{tx.Details}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {transactions.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No transactions found.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Information</CardTitle>
                  <CardDescription>Security answers and transaction PIN</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Security Answers</h4>
                    {security_answers ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Answer 1</Label>
                          <Input value={security_answers.ans1} readOnly className="bg-gray-50" />
                        </div>
                        <div className="space-y-2">
                          <Label>Answer 2</Label>
                          <Input value={security_answers.ans2} readOnly className="bg-gray-50" />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500">No security answers configured</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Transaction PIN</h4>
                    {transaction_pin ? (
                      <div className="space-y-2">
                        <Label htmlFor="transactionPin">Current PIN</Label>
                        <div className="flex space-x-4">
                          <Input 
                            id="transactionPin" 
                            value={transaction_pin.transfer_pin} 
                            readOnly 
                            className="bg-gray-50 max-w-32"
                          />
                          <Button variant="outline" size="sm">Reset PIN</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500">No transaction PIN configured</p>
                      </div>
                    )}
                  </div>

                  {otp && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">OTP Information</h4>
                      <div className="space-y-2">
                        <Label htmlFor="currentOtp">Current OTP</Label>
                        <Input 
                          id="currentOtp" 
                          value={otp.otp} 
                          readOnly 
                          className="bg-gray-50 max-w-32"
                        />
                      </div>
                    </div>
                  )}
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
