
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Filter, Eye, Check, X, Clock } from 'lucide-react';
import { apiService, Transaction } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const TransactionManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getTransactions();
      console.log('Transactions data:', data);
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.id.toString().includes(searchTerm) ||
                         transaction.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.recipient_account_number.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || transaction.status_type.toLowerCase() === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.transaction_type.toLowerCase().includes(typeFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return <Badge variant="outline" className="border-orange-200 text-orange-700"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'APPROVED':
        return <Badge variant="outline" className="border-green-200 text-green-700"><Check className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleApprove = async (transactionId: number) => {
    try {
      setIsApproving(transactionId);
      await apiService.approveTransaction(transactionId);
      toast({
        title: "Success",
        description: "Transaction approved successfully",
      });
      // Refresh transactions
      fetchTransactions();
    } catch (error) {
      console.error('Failed to approve transaction:', error);
      toast({
        title: "Error",
        description: "Failed to approve transaction",
        variant: "destructive",
      });
    } finally {
      setIsApproving(null);
    }
  };

  const handleReject = (transactionId: number) => {
    console.log('Rejecting transaction:', transactionId);
    // API call would go here - not provided in requirements
    toast({
      title: "Info",
      description: "Reject functionality not yet implemented",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transaction Management</h1>
            <p className="text-gray-600 mt-1">Loading transactions...</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaction Management</h1>
          <p className="text-gray-600 mt-1">Review and manage money transfers</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>
            Monitor and approve pending transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by transaction ID, recipient name, or account number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="international">International</SelectItem>
                <SelectItem value="commerzeciti">Commerzeciti</SelectItem>
                <SelectItem value="received">Received</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-medium text-gray-900">Transaction ID</th>
                  <th className="text-left p-4 font-medium text-gray-900">Recipient</th>
                  <th className="text-left p-4 font-medium text-gray-900">Account Number</th>
                  <th className="text-left p-4 font-medium text-gray-900">Amount</th>
                  <th className="text-left p-4 font-medium text-gray-900">Type</th>
                  <th className="text-left p-4 font-medium text-gray-900">Status</th>
                  <th className="text-left p-4 font-medium text-gray-900">Date</th>
                  <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <span className="font-medium text-blue-600">TXN{transaction.id.toString().padStart(3, '0')}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-900">{transaction.recipient_name}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-900">{transaction.recipient_account_number}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-gray-900">${transaction.amount}</span>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{transaction.transaction_type}</Badge>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(transaction.status_type)}
                    </td>
                    <td className="p-4">
                      <span className="text-gray-600">{formatDate(transaction.date)}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Transaction Details</DialogTitle>
                              <DialogDescription>
                                Complete information for transaction TXN{transaction.id.toString().padStart(3, '0')}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Recipient</Label>
                                  <p className="text-sm text-gray-900">{transaction.recipient_name}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Amount</Label>
                                  <p className="text-sm font-medium text-gray-900">${transaction.amount}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Account Number</Label>
                                  <p className="text-sm text-gray-900">{transaction.recipient_account_number}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Type</Label>
                                  <p className="text-sm text-gray-900">{transaction.transaction_type}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Routing Number</Label>
                                  <p className="text-sm text-gray-900">{transaction.recipient_routing_number || 'N/A'}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                                  <div className="mt-1">{getStatusBadge(transaction.status_type)}</div>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Bank Name</Label>
                                <p className="text-sm text-gray-900">{transaction.recipient_bank_name || 'N/A'}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Date & Time</Label>
                                <p className="text-sm text-gray-900">{formatDate(transaction.date)}</p>
                              </div>
                              
                              {transaction.status_type.toUpperCase() === 'PENDING' && (
                                <div className="flex space-x-2 pt-4">
                                  <Button 
                                    variant="default" 
                                    size="sm" 
                                    onClick={() => handleApprove(transaction.id)}
                                    disabled={isApproving === transaction.id}
                                    className="flex-1"
                                  >
                                    <Check className="w-4 h-4 mr-1" />
                                    {isApproving === transaction.id ? 'Approving...' : 'Approve'}
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm" 
                                    onClick={() => handleReject(transaction.id)}
                                    className="flex-1"
                                  >
                                    <X className="w-4 h-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        {transaction.status_type.toUpperCase() === 'PENDING' && (
                          <>
                            <Button 
                              variant="default" 
                              size="sm" 
                              onClick={() => handleApprove(transaction.id)}
                              disabled={isApproving === transaction.id}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => handleReject(transaction.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No transactions found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionManagement;
