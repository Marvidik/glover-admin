
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Key, Shield, Edit, Save, X } from 'lucide-react';
import { apiService, BankCodes, LoginPin } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const PinCodeManagement = () => {
  const [bankCodes, setBankCodes] = useState<BankCodes | null>(null);
  const [loginPin, setLoginPin] = useState<LoginPin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCodes, setEditingCodes] = useState(false);
  const [editingPin, setEditingPin] = useState(false);
  const [tempCodes, setTempCodes] = useState<Partial<BankCodes>>({});
  const [tempPin, setTempPin] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [codes, pin] = await Promise.all([
          apiService.getBankCodes(),
          apiService.getLoginPin()
        ]);
        setBankCodes(codes);
        setLoginPin(pin);
        setTempCodes(codes);
        setTempPin(pin.pin);
      } catch (error) {
        console.error('Failed to fetch pin/code data:', error);
        toast({
          title: "Error",
          description: "Failed to load PIN and code data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleUpdateCodes = async () => {
    try {
      const updated = await apiService.updateBankCodes(tempCodes);
      setBankCodes(updated);
      setEditingCodes(false);
      toast({
        title: "Success",
        description: "Bank codes updated successfully",
      });
    } catch (error) {
      console.error('Failed to update bank codes:', error);
      toast({
        title: "Error",
        description: "Failed to update bank codes",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePin = async () => {
    try {
      const updated = await apiService.updateLoginPin(tempPin);
      setLoginPin(updated);
      setEditingPin(false);
      toast({
        title: "Success",
        description: "Login PIN updated successfully",
      });
    } catch (error) {
      console.error('Failed to update login PIN:', error);
      toast({
        title: "Error",
        description: "Failed to update login PIN",
        variant: "destructive",
      });
    }
  };

  const cancelEditCodes = () => {
    setTempCodes(bankCodes || {});
    setEditingCodes(false);
  };

  const cancelEditPin = () => {
    setTempPin(loginPin?.pin || 0);
    setEditingPin(false);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">PIN & Code Management</h1>
            <p className="text-gray-600 mt-1">Loading security settings...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">PIN & Code Management</h1>
          <p className="text-gray-600 mt-1">Manage system security codes and PINs</p>
        </div>
      </div>

      <Tabs defaultValue="codes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="codes" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Bank Codes</span>
          </TabsTrigger>
          <TabsTrigger value="pin" className="flex items-center space-x-2">
            <Key className="w-4 h-4" />
            <span>Login PIN</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="codes">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Bank Security Codes</span>
                  </CardTitle>
                  <CardDescription>
                    Manage IMF, IPN, and Bank Transfer codes
                  </CardDescription>
                </div>
                {!editingCodes ? (
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingCodes(true)}
                    className="flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={cancelEditCodes}
                      className="flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </Button>
                    <Button 
                      onClick={handleUpdateCodes}
                      className="flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="imfcode">IMF Code</Label>
                  <Input
                    id="imfcode"
                    value={editingCodes ? tempCodes.imfcode || '' : bankCodes?.imfcode || ''}
                    onChange={(e) => setTempCodes({...tempCodes, imfcode: e.target.value})}
                    disabled={!editingCodes}
                    placeholder="Enter IMF code"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ipncode">IPN Code</Label>
                  <Input
                    id="ipncode"
                    value={editingCodes ? tempCodes.ipncode || '' : bankCodes?.ipncode || ''}
                    onChange={(e) => setTempCodes({...tempCodes, ipncode: e.target.value})}
                    disabled={!editingCodes}
                    placeholder="Enter IPN code"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transfercode">Bank Transfer Code</Label>
                  <Input
                    id="transfercode"
                    value={editingCodes ? tempCodes.bank_transfercode || '' : bankCodes?.bank_transfercode || ''}
                    onChange={(e) => setTempCodes({...tempCodes, bank_transfercode: e.target.value})}
                    disabled={!editingCodes}
                    placeholder="Enter transfer code"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pin">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Key className="w-5 h-5" />
                    <span>Login PIN</span>
                  </CardTitle>
                  <CardDescription>
                    Manage system login PIN
                  </CardDescription>
                </div>
                {!editingPin ? (
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingPin(true)}
                    className="flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={cancelEditPin}
                      className="flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </Button>
                    <Button 
                      onClick={handleUpdatePin}
                      className="flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-w-md space-y-2">
                <Label htmlFor="loginpin">Login PIN</Label>
                <Input
                  id="loginpin"
                  type="number"
                  value={editingPin ? tempPin : loginPin?.pin || ''}
                  onChange={(e) => setTempPin(parseInt(e.target.value) || 0)}
                  disabled={!editingPin}
                  placeholder="Enter 4-digit PIN"
                  maxLength={4}
                />
                <p className="text-sm text-gray-500">
                  Enter a 4-digit numeric PIN for system login authentication
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PinCodeManagement;
