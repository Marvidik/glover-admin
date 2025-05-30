import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import type { Transaction } from '@/services/api';
import { Plus, Eye, Check, Clock, X } from 'lucide-react';

interface TransactionManagementProps {
  onCreateTransaction: () => void;
}

const TransactionManagement = ({ onCreateTransaction }: TransactionManagementProps) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => apiService.getTransactions(),
  });

  const approveMutation = useMutation({
    mutationFn: (transactionId: number) => apiService.approveTransaction(transactionId),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Transaction approved successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setSelectedTransaction(null);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to approve transaction',
        variant: 'destructive',
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaction Management</h1>
          <p className="text-gray-600 mt-2">Manage and approve user transactions</p>
        </div>
        <Button onClick={onCreateTransaction} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Transaction
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>
              {transactions?.length || 0} transactions found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions?.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{transaction.recipient_name}</h3>
                      {getStatusBadge(transaction.status_type)}
                      <span className="text-sm text-gray-500">
                        {transaction.transaction_type}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Account: {transaction.recipient_account_number}</p>
                      <p>Bank: {transaction.recipient_bank_name}</p>
                      <p>Date: {formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600">
                        ${parseFloat(transaction.amount).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTransaction(transaction)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {transaction.status_type.toLowerCase() === 'pending' && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => approveMutation.mutate(transaction.id)}
                          disabled={approveMutation.isPending}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {transactions?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No transactions found
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Transaction Details Modal */}
        {selectedTransaction && (
          <Card className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Transaction Details</CardTitle>
                  <CardDescription>ID: {selectedTransaction.id}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTransaction(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Recipient Name</label>
                    <p className="font-semibold">{selectedTransaction.recipient_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Amount</label>
                    <p className="font-semibold text-green-600">
                      ${parseFloat(selectedTransaction.amount).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Number</label>
                    <p>{selectedTransaction.recipient_account_number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Routing Number</label>
                    <p>{selectedTransaction.recipient_routing_number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Bank Name</label>
                    <p>{selectedTransaction.recipient_bank_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Transaction Type</label>
                    <p>{selectedTransaction.transaction_type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedTransaction.status_type)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date</label>
                    <p>{formatDate(selectedTransaction.date)}</p>
                  </div>
                </div>
                
                {selectedTransaction.status_type.toLowerCase() === 'pending' && (
                  <div className="flex justify-end pt-4 border-t">
                    <Button
                      onClick={() => approveMutation.mutate(selectedTransaction.id)}
                      disabled={approveMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      {approveMutation.isPending ? 'Approving...' : 'Approve Transaction'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TransactionManagement;
