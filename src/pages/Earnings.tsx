import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Calendar, 
  DollarSign, 
  Package, 
  Clock, 
  TrendingUp, 
  Search,
  X,
  Check,
  CreditCard
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DateRange } from 'react-day-picker';
import { isWithinInterval, parseISO, startOfMonth } from 'date-fns';
import UnifiedHeader from "@/components/UnifiedHeader";
import DesktopSidebar from "@/components/DesktopSidebar";
import DateRangePicker from "@/components/DateRangePicker";
import margaritaMamasLogo from '@/assets/margarita-mamas-logo.png';
import salDeMarLogo from '@/assets/sal-de-mar-logo.png';
import { useToast } from "@/hooks/use-toast";

interface EarningDetail {
  id: string;
  restaurantName: string;
  restaurantLogo: string;
  orderId: string;
  deliveryFee: number;
  tips: number;
  deliveryDate: string;
  dateTime: Date; // Add datetime for filtering
}

interface PaymentMethod {
  id: string;
  type: 'visa' | 'paypal' | 'bank';
  label: string;
  lastFour?: string;
}

const Earnings: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const { toast } = useToast();

  // Mock data
  const totalEarnings = 620.50;
  const totalDeliveries = 56;
  const totalHours = 72;
  const currentBalance = 48.12;
  const minimumWithdraw = 20.00;
  const availableBalance = 50.00;
  const changePercent = 4.07;

  // Chart data for earnings overview with dates
  const allChartData = [
    { date: 'Sep 1', basePay: 3, tip: 2, dateTime: new Date(2025, 8, 1) },
    { date: 'Sep 2', basePay: 5, tip: 3, dateTime: new Date(2025, 8, 2) },
    { date: 'Sep 3', basePay: 8, tip: 6, dateTime: new Date(2025, 8, 3) },
    { date: 'Sep 4', basePay: 12, tip: 8, dateTime: new Date(2025, 8, 4) },
    { date: 'Sep 5', basePay: 15, tip: 12, dateTime: new Date(2025, 8, 5) },
    { date: 'Sep 6', basePay: 16, tip: 13, dateTime: new Date(2025, 8, 6) },
    { date: 'Sep 7', basePay: 17, tip: 14, dateTime: new Date(2025, 8, 7) },
    { date: 'Sep 8', basePay: 16, tip: 13, dateTime: new Date(2025, 8, 8) },
    { date: 'Sep 9', basePay: 14.5, tip: 11, dateTime: new Date(2025, 8, 9) },
    { date: 'Sep 10', basePay: 13, tip: 10, dateTime: new Date(2025, 8, 10) },
    { date: 'Sep 11', basePay: 11, tip: 8, dateTime: new Date(2025, 8, 11) },
    { date: 'Sep 12', basePay: 12, tip: 9, dateTime: new Date(2025, 8, 12) },
    { date: 'Sep 15', basePay: 8, tip: 6, dateTime: new Date(2025, 8, 15) },
    { date: 'Sep 18', basePay: 18, tip: 15, dateTime: new Date(2025, 8, 18) },
    { date: 'Sep 20', basePay: 14, tip: 12, dateTime: new Date(2025, 8, 20) }
  ];

  // Filter chart data based on date range
  const chartData = allChartData.filter((dataPoint) => {
    if (!dateRange?.from) return true;
    
    if (dateRange.to) {
      return isWithinInterval(dataPoint.dateTime, {
        start: dateRange.from,
        end: dateRange.to,
      });
    }
    
    return dataPoint.dateTime >= dateRange.from;
  });

  const paymentMethods: PaymentMethod[] = [
    { id: '1', type: 'visa', label: 'Visa .... 1316', lastFour: '1316' },
    { id: '2', type: 'paypal', label: 'PayPal' }
  ];

  const allEarningDetails: EarningDetail[] = [
    {
      id: '1',
      restaurantName: "Margarita Mama's",
      restaurantLogo: margaritaMamasLogo,
      orderId: '13456787',
      deliveryFee: 20.00,
      tips: 12.50,
      deliveryDate: 'Sep 7, 2025 11:50AM',
      dateTime: new Date(2025, 8, 7, 11, 50)
    },
    {
      id: '2',
      restaurantName: 'Sal De Mar',
      restaurantLogo: salDeMarLogo,
      orderId: '13456788',
      deliveryFee: 18.00,
      tips: 8.75,
      deliveryDate: 'Sep 15, 2025 2:30PM',
      dateTime: new Date(2025, 8, 15, 14, 30)
    },
    {
      id: '3',
      restaurantName: "Margarita Mama's",
      restaurantLogo: margaritaMamasLogo,
      orderId: '13456789',
      deliveryFee: 22.50,
      tips: 15.00,
      deliveryDate: 'Sep 20, 2025 7:15PM',
      dateTime: new Date(2025, 8, 20, 19, 15)
    },
    {
      id: '4',
      restaurantName: 'Sal De Mar',
      restaurantLogo: salDeMarLogo,
      orderId: '13456790',
      deliveryFee: 16.25,
      tips: 9.50,
      deliveryDate: 'Sep 10, 2025 12:45PM',
      dateTime: new Date(2025, 8, 10, 12, 45)
    },
    {
      id: '5',
      restaurantName: "Margarita Mama's",
      restaurantLogo: margaritaMamasLogo,
      orderId: '13456791',
      deliveryFee: 19.75,
      tips: 11.25,
      deliveryDate: 'Sep 5, 2025 6:20PM',
      dateTime: new Date(2025, 8, 5, 18, 20)
    }
  ];

  // Filter earning details based on date range and search term
  const filteredDetails = allEarningDetails.filter(detail => {
    const matchesSearch = detail.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detail.orderId.includes(searchTerm);
    
    if (!dateRange?.from) return matchesSearch;
    
    const matchesDate = dateRange.to 
      ? isWithinInterval(detail.dateTime, {
          start: dateRange.from,
          end: dateRange.to,
        })
      : detail.dateTime >= dateRange.from;
    
    return matchesSearch && matchesDate;
  });

  const earningDetails = filteredDetails;

  const balanceProgress = (currentBalance / minimumWithdraw) * 100;

  const handleWithdrawClick = () => {
    if (currentBalance < minimumWithdraw) {
      toast({
        title: "Insufficient Balance",
        description: `You must have at least $${minimumWithdraw.toFixed(2)} to withdraw balance.`,
        variant: "destructive"
      });
      return;
    }
    setShowMethodModal(true);
  };

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setShowMethodModal(false);
    setShowAmountModal(true);
  };

  const handleAmountConfirm = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount.",
        variant: "destructive"
      });
      return;
    }
    if (amount > availableBalance) {
      toast({
        title: "Insufficient Funds",
        description: `You can only withdraw up to $${availableBalance.toFixed(2)}.`,
        variant: "destructive"
      });
      return;
    }
    setShowAmountModal(false);
    setShowConfirmModal(true);
  };

  const handleFinalConfirm = () => {
    setShowConfirmModal(false);
    setWithdrawAmount('');
    setSelectedMethod(null);
    toast({
      title: "Withdrawal Submitted",
      description: "Your withdrawal request has been submitted successfully.",
      variant: "success"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <UnifiedHeader />
      <DesktopSidebar />
      
      {/* Main Content */}
      <div className="lg:ml-64 pt-4">
        <div className="container mx-auto px-4 py-6 space-y-6 lg:px-8 lg:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2 lg:text-3xl">Earnings</h1>
              <p className="text-muted-foreground lg:text-lg">Track your delivery earnings and manage withdrawals</p>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <DateRangePicker
                date={dateRange}
                onDateChange={setDateRange}
                placeholder="Select date range"
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-muted-foreground">Earnings</h3>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <DollarSign className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold">${totalEarnings}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className="bg-green-100 text-green-700 hover:bg-green-100"
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{changePercent}%
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Since last month
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-muted-foreground">Deliveries</h3>
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Package className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold">{totalDeliveries}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className="bg-green-100 text-green-700 hover:bg-green-100"
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{changePercent}%
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Since last month
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-muted-foreground">Hours</h3>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold">{totalHours}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className="bg-green-100 text-green-700 hover:bg-green-100"
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{changePercent}%
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Since last month
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-muted-foreground">Balance</h3>
                  </div>
                  
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold">${currentBalance.toFixed(2)}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Progress value={balanceProgress} className="h-2" />
                    <p className="text-sm text-muted-foreground">
                      You must have at least ${minimumWithdraw.toFixed(2)} to withdraw balance.
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleWithdrawClick}
                    className="w-full"
                    disabled={currentBalance < minimumWithdraw}
                  >
                    Withdraw
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Earnings Overview Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
              <p className="text-sm text-muted-foreground">Including base pay & customer tips</p>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      tickFormatter={(value) => `${value}$`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                      formatter={(value: number, name: string) => [
                        `$${value.toFixed(2)}`, 
                        name === 'basePay' ? 'Base Pay' : 'Tip'
                      ]}
                      labelStyle={{ color: '#1e293b', fontWeight: 'medium' }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px' }}
                      formatter={(value) => (
                        <span style={{ color: '#64748b' }}>
                          {value === 'basePay' ? 'Base Pay' : 'Tip'}
                        </span>
                      )}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="basePay" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="tip" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Details Section */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="space-y-4">
                {filteredDetails.map((detail) => (
                  <div key={detail.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                        <img 
                          src={detail.restaurantLogo} 
                          alt={detail.restaurantName}
                          className="h-full w-full object-cover rounded-full"
                        />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold">{detail.restaurantName}</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Order ID:</span> {detail.orderId}
                        </div>
                        <div>
                          <span className="font-medium">Delivery Fee:</span> ${detail.deliveryFee.toFixed(2)}
                        </div>
                        <div>
                          <span className="font-medium">Tips:</span> ${detail.tips.toFixed(2)}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {detail.deliveryDate}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Method Selection Modal */}
      <Dialog open={showMethodModal} onOpenChange={setShowMethodModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Select Transfer Method
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowMethodModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-3 text-muted-foreground">Method</h4>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <Button
                    key={method.id}
                    variant="outline"
                    className="w-full justify-between h-auto p-4"
                    onClick={() => handleMethodSelect(method)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-6 bg-blue-600 text-white text-xs font-bold rounded">
                        {method.type === 'visa' ? 'VISA' : 'PP'}
                      </div>
                      <span>{method.label}</span>
                    </div>
                    {selectedMethod?.id === method.id && (
                      <Check className="h-4 w-4 text-blue-600" />
                    )}
                  </Button>
                ))}
              </div>
            </div>
            
            <Button variant="link" className="text-blue-600 p-0">
              Add New Method
            </Button>
          </div>
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowMethodModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => selectedMethod && handleMethodSelect(selectedMethod)}
              disabled={!selectedMethod}
            >
              Next
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Amount Selection Modal */}
      <Dialog open={showAmountModal} onOpenChange={setShowAmountModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Select Transfer Amount
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowAmountModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-3 text-muted-foreground">Method</h4>
              {selectedMethod && (
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex items-center justify-center w-8 h-6 bg-blue-600 text-white text-xs font-bold rounded">
                    {selectedMethod.type === 'visa' ? 'VISA' : 'PP'}
                  </div>
                  <span>{selectedMethod.label}</span>
                </div>
              )}
            </div>
            
            <div>
              <h4 className="font-medium mb-3 text-muted-foreground">Amount</h4>
              <Input
                type="number"
                placeholder="$0.00"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="text-lg"
              />
              <div className="mt-2 space-y-1">
                <p className="text-sm font-medium">${availableBalance.toFixed(2)} available</p>
                <p className="text-sm text-muted-foreground">Amount must be a whole number</p>
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowAmountModal(false)}>
              Back
            </Button>
            <Button onClick={handleAmountConfirm}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Your Withdrawal is Complete!
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowConfirmModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-muted-foreground">
              We're currently processing your transaction, please allow 1-2 days for your payment to arrive.
            </p>
            <p className="text-muted-foreground">
              In case of questions, please contact{' '}
              <a href="mailto:support@daze.com" className="text-blue-600 hover:underline">
                support@daze.com
              </a>
            </p>
            
            <div className="space-y-3 pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <div className="flex items-center gap-2">
                  {selectedMethod && (
                    <>
                      <div className="flex items-center justify-center w-8 h-6 bg-blue-600 text-white text-xs font-bold rounded">
                        {selectedMethod.type === 'visa' ? 'VISA' : 'PP'}
                      </div>
                      <span>{selectedMethod.label}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">${withdrawAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fee</span>
                <span className="font-medium">$1.50</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={handleFinalConfirm} className="w-full">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Earnings;