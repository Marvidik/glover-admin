'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import { ArrowLeft, Send } from 'lucide-react';

const transactionSchema = z.object({
  recipient_name: z.string().min(1, 'Recipient name is required'),
  recipient_account_number: z.string().min(1, 'Account number is required'),
  recipient_routing_number: z.string().min(1, 'Routing number is required'),
  recipient_bank_name: z.string().min(1, 'Bank name is required'),
  swift_code: z.string().min(1, 'SWIFT code is required'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Amount must be a positive number'),
  transaction_type: z.enum([
    'Received',
    'Local',
    'International',
    'Inter-bank',
    'ATM',
  ]),
  narration: z.string().min(1, 'Narration is required'),
  date: z.string().min(1, 'Date and time is required'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface CreateTransactionProps {
  onBack: () => void;
}

const CreateTransaction = ({ onBack }: CreateTransactionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState<TransactionFormData | null>(null);
  const { toast } = useToast();

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      recipient_name: '',
      recipient_account_number: '',
      recipient_routing_number: '',
      recipient_bank_name: '',
      swift_code: '',
      amount: '',
      transaction_type: 'Local',
      narration: '',
      date: new Date().toISOString().slice(0, 16),
    },
  });

  const onSubmit = (data: TransactionFormData) => {
    setFormData(data);
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    if (!formData) return;

    setIsSubmitting(true);
    try {
      const dateTimeLocal = formData.date;
      const isoDateString =
        dateTimeLocal.includes(':') && dateTimeLocal.length === 16
          ? `${dateTimeLocal}:00Z`
          : new Date(dateTimeLocal).toISOString();

      await apiService.createTransaction({
        recipient_name: formData.recipient_name,
        recipient_account_number: formData.recipient_account_number,
        recipient_routing_number: formData.recipient_routing_number,
        recipient_bank_name: formData.recipient_bank_name,
        swift_code: formData.swift_code,
        amount: parseFloat(formData.amount),
        transaction_type: formData.transaction_type,
        narration: formData.narration,
        date: isoDateString,
      });

      toast({
        title: 'Success',
        description: 'Transaction created successfully',
      });

      form.reset();
      setShowConfirmDialog(false);
      onBack();
    } catch (error) {
      console.error('Transaction creation error:', error);
      toast({
        title: 'Error',
        description: 'Failed to create transaction. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-4 md:mb-6">
        <Button variant="ghost" onClick={onBack} className="mb-4 px-2 md:px-4" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Back to Transactions</span>
          <span className="sm:hidden">Back</span>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create Transaction</h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
            Create a new bank transaction for processing
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Transaction Details</CardTitle>
          <CardDescription className="text-sm">
            Fill in the transaction information below. All fields are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <FormField
                  control={form.control}
                  name="recipient_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recipient_account_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recipient_routing_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Routing Number</FormLabel>
                      <FormControl>
                        <Input placeholder="110000000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recipient_bank_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Bank of America" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="swift_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SWIFT Code</FormLabel>
                      <FormControl>
                        <Input placeholder="BOFAUS3N" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="100.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transaction_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select transaction type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Received">Received</SelectItem>
                          <SelectItem value="Local">Local</SelectItem>
                          <SelectItem value="International">International</SelectItem>
                          <SelectItem value="Inter-bank">Inter-bank</SelectItem>
                          <SelectItem value="ATM">ATM</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date and Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="narration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Narration</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Transaction description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-2">
                <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                  <Send className="mr-2 h-4 w-4" />
                  Create Transaction
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Transaction</DialogTitle>
            <DialogDescription>
              Are you sure you want to create this transaction? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTransaction;
