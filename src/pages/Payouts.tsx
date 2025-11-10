import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard, Plus, ChevronLeft, ChevronRight, X, Clock, CheckCircle, Building, User } from 'lucide-react';
import UnifiedHeader from "@/components/UnifiedHeader";
import DesktopSidebar from "@/components/DesktopSidebar";

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'paypal' | 'bank_account';
  name: string;
  details: string;
  cardNumber?: string;
  expiryDate?: string;
  isDefault: boolean;
}

interface PayoutTransaction {
  id: string;
  method: string;
  amount: number;
  status: 'delivered' | 'pending' | 'processing';
  requestDate: string;
  transferDate?: string;
  methodType: 'paypal' | 'credit_card' | 'bank_account';
}

const Payouts: React.FC = () => {
  const [showAddMethodModal, setShowAddMethodModal] = useState(false);
  const [showUpdateCardModal, setShowUpdateCardModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Mock payment methods data
  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'credit_card',
      name: 'Brian Smith',
      details: '**** **** **** 1234',
      cardNumber: '1234',
      expiryDate: '01/23',
      isDefault: true
    },
    {
      id: '2',
      type: 'paypal',
      name: 'PayPal Account',
      details: 'brian.smith@email.com',
      isDefault: false
    },
    {
      id: '3',
      type: 'bank_account',
      name: 'Chase Bank',
      details: '****9876',
      isDefault: false
    }
  ];

  // Mock payout transactions
  const payoutTransactions: PayoutTransaction[] = [
    {
      id: '1',
      method: 'PayPal',
      amount: 56.00,
      status: 'delivered',
      requestDate: 'May 6, 2021 10:40AM',
      transferDate: 'May 7, 2021 11:50AM',
      methodType: 'paypal'
    },
    {
      id: '2',
      method: 'PayPal',
      amount: 56.00,
      status: 'pending',
      requestDate: 'May 6, 2021 10:40AM',
      transferDate: 'May 7, 2021 11:50AM',
      methodType: 'paypal'
    },
    {
      id: '3',
      method: 'Credit Card',
      amount: 124.50,
      status: 'delivered',
      requestDate: 'May 4, 2021 2:15PM',
      transferDate: 'May 5, 2021 3:20PM',
      methodType: 'credit_card'
    },
    {
      id: '4',
      method: 'Bank Account',
      amount: 89.75,
      status: 'processing',
      requestDate: 'May 3, 2021 9:30AM',
      transferDate: 'May 4, 2021 10:45AM',
      methodType: 'bank_account'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Delivered
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
      case 'processing':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Processing
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'credit_card':
        return <CreditCard className="w-5 h-5 text-blue-600" />;
      case 'paypal':
        return <div className="w-5 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">P</div>;
      case 'bank_account':
        return <Building className="w-5 h-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % paymentMethods.length);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + paymentMethods.length) % paymentMethods.length);
  };

  const PaymentMethodCard = ({ method, index }: { method: PaymentMethod; index: number }) => {
    const isVisible = index === currentCardIndex;
    const bgColor = method.type === 'credit_card' 
      ? 'bg-gradient-to-br from-red-400 to-red-500' 
      : method.type === 'paypal'
      ? 'bg-gradient-to-br from-blue-400 to-blue-500'
      : 'bg-gradient-to-br from-purple-400 to-purple-500';

    return (
      <div className={`${isVisible ? 'block' : 'hidden'} relative`}>
        <div className={`${bgColor} text-white p-6 rounded-xl min-h-[200px] flex flex-col justify-between shadow-lg`}>
          <div className="flex justify-between items-start">
            <div className="text-sm opacity-90">Update</div>
            <div className="text-right">
              {method.type === 'credit_card' && (
                <div className="text-2xl font-bold">VISA</div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-xl font-semibold">{method.name}</div>
            {method.type === 'credit_card' ? (
              <>
                <div className="text-lg tracking-wider">{method.details}</div>
                <div className="text-sm opacity-90">{method.expiryDate}</div>
              </>
            ) : (
              <div className="text-sm opacity-90">{method.details}</div>
            )}
          </div>
        </div>
        
        {paymentMethods.length > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            {paymentMethods.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx === currentCardIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pt-[100px] lg:pt-[56px]">
      <UnifiedHeader />
      <DesktopSidebar />
      
      {/* Main Content */}
      <div className="lg:ml-64 pt-4">
        <div className="container mx-auto px-4 py-6 space-y-6 lg:px-4 lg:py-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2 lg:text-3xl">Payouts</h1>
            <p className="text-muted-foreground lg:text-lg">Manage your payment methods and payout history</p>
          </div>

          {/* Payment Methods Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Payment Methods</CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddMethodModal(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Payment Method
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {paymentMethods.length > 0 ? (
                <div className="relative">
                  {paymentMethods.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
                        onClick={prevCard}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
                        onClick={nextCard}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  
                  <div className="max-w-md mx-auto">
                    {paymentMethods.map((method, index) => (
                      <PaymentMethodCard key={method.id} method={method} index={index} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No payment methods added yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payouts History Section */}
          <Card>
            <CardHeader>
              <CardTitle>Payouts History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payoutTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getPaymentMethodIcon(transaction.methodType)}
                        <div>
                          <div className="font-medium">{transaction.method}</div>
                          {getStatusBadge(transaction.status)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-lg">${transaction.amount.toFixed(2)}</div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div><span className="font-medium">Request Date:</span> {transaction.requestDate}</div>
                      {transaction.transferDate && (
                        <div><span className="font-medium">Transfer Date:</span> {transaction.transferDate}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      <Dialog open={showAddMethodModal} onOpenChange={setShowAddMethodModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Add Payment Method</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddMethodModal(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <Label className="text-base font-medium">Method</Label>
            
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-between h-12"
                onClick={() => {
                  setShowAddMethodModal(false);
                  // Handle credit card selection
                }}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span>Credit card</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-between h-12"
                onClick={() => {
                  setShowAddMethodModal(false);
                  // Handle PayPal selection
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">P</div>
                  <span>PayPal</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-between h-12"
                onClick={() => {
                  setShowAddMethodModal(false);
                  // Handle bank account selection
                }}
              >
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-orange-600" />
                  <span>Bank Account</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Credit Card Modal */}
      <Dialog open={showUpdateCardModal} onOpenChange={setShowUpdateCardModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Credit Card</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Card</Label>
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
                <div className="text-blue-600 font-bold text-sm">VISA</div>
                <span className="text-sm">Visa ... 1316</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Card holder name</Label>
              <Input defaultValue="Brian Li" />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="default" defaultChecked />
              <Label htmlFor="default">Set this card as default</Label>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowUpdateCardModal(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={() => setShowUpdateCardModal(false)}
              >
                Confirm
              </Button>
            </div>
            
            <Button 
              variant="ghost" 
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Delete Card
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payouts;