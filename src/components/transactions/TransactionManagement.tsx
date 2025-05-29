
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Filter, Eye, Check, X, Clock } from 'lucide-react';

const TransactionManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const transactions = [
    {
      id: 'TXN001',
      from: 'John Smith',
      to: 'Sarah Johnson',
      amount: '$500.00',
      type: 'Local Transfer',
      status: 'Pending',
      date: '2024-03-15 14:30:00',
      reference: 'REF123456',
      description: 'Monthly rent payment',
    },
    {
      id: 'TXN002',
      from: 'Emily Davis',
      to: 'Mike Wilson',
      amount: '$1,200.00',
      type: 'International',
      status: 'Approved',
      date: '2024-03-15 12:15:00',
      reference: 'REF123457',
      description: 'Business payment',
    },
    {
      id: 'TXN003',
      from: 'Sarah Johnson',
      to: 'CommerzeCiti Bank',
      amount: '$2,500.00',
      type: 'CommerzeCiti',
      status: 'Pending',
      date: '2024-03-15 10:45:00',
      reference: 'REF123458',
      description: 'Investment transfer',
    },
    {
      id: 'TXN004',
      from: 'Mike Wilson',
      to: 'Emily Davis',
      amount: '$750.00',
      type: 'Local Transfer',
      status: 'Rejected',
      date: '2024-03-14 16:20:00',
      reference: 'REF123459',
      description: 'Loan repayment',
    },
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.to.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status.toLowerCase() === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type.toLowerCase().includes(typeFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="outline" className="border-orange-200 text-orange-700"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'Approved':
        return <Badge variant="outline" className="border-green-200 text-green-700"><Check className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'Rejected':
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleApprove = (transactionId: string) => {
    console.log('Approving transaction:', transactionId);
    // API call would go here
  };

  const handleReject = (transactionId: string) => {
    console.log('Rejecting transaction:', transactionId);
    // API call would go here
  };

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
                placeholder="Search by transaction ID, sender, or recipient..."
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
                <SelectItem value="local">Local Transfer</SelectItem>
                <SelectItem value="international">International</SelectItem>
                <SelectItem value="commerze">CommerzeCiti</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-medium text-gray-900">Transaction ID</th>
                  <th className="text-left p-4 font-medium text-gray-900">From</th>
                  <th className="text-left p-4 font-medium text-gray-900">To</th>
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
                      <span className="font-medium text-blue-600">{transaction.id}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-900">{transaction.from}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-900">{transaction.to}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-gray-900">{transaction.amount}</span>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{transaction.type}</Badge>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="p-4">
                      <span className="text-gray-600">{transaction.date}</span>
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
                                Complete information for transaction {transaction.id}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">From</Label>
                                  <p className="text-sm text-gray-900">{transaction.from}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">To</Label>
                                  <p className="text-sm text-gray-900">{transaction.to}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Amount</Label>
                                  <p className="text-sm font-medium text-gray-900">{transaction.amount}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Type</Label>
                                  <p className="text-sm text-gray-900">{transaction.type}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Reference</Label>
                                  <p className="text-sm text-gray-900">{transaction.reference}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                                  <div className="mt-1">{getStatusBadge(transaction.status)}</div>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Description</Label>
                                <p className="text-sm text-gray-900">{transaction.description}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Date & Time</Label>
                                <p className="text-sm text-gray-900">{transaction.date}</p>
                              </div>
                              
                              {transaction.status === 'Pending' && (
                                <div className="flex space-x-2 pt-4">
                                  <Button 
                                    variant="default" 
                                    size="sm" 
                                    onClick={() => handleApprove(transaction.id)}
                                    className="flex-1"
                                  >
                                    <Check className="w-4 h-4 mr-1" />
                                    Approve
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
                        
                        {transaction.status === 'Pending' && (
                          <>
                            <Button 
                              variant="default" 
                              size="sm" 
                              onClick={() => handleApprove(transaction.id)}
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
