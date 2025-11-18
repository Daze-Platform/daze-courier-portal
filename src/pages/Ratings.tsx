import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Calendar, ChevronDown, Star, TrendingUp, TrendingDown, Award, MessageSquare } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import UnifiedHeader from "@/components/UnifiedHeader";
import DesktopSidebar from "@/components/DesktopSidebar";
import { useIsPWA } from "@/hooks/use-is-pwa";
import emptyRatingsIllustration from '@/assets/empty-ratings-illustration.jpg';

interface CustomerReview {
  id: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  orderId: string;
  deliveryDate: string;
  comment?: string;
}

interface RatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}

const Ratings: React.FC = () => {
  const isPWA = useIsPWA();
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [hasReviews] = useState(true); // Toggle this to show empty state

  // Sample data
  const averageRating = 4.62;
  const ratingChange = 4.07;
  const totalRatings = 78;
  const ratingsChange = -2.00;

  const ratingDistribution: RatingDistribution[] = [
    { stars: 5, count: 59, percentage: 76 },
    { stars: 4, count: 16, percentage: 20 },
    { stars: 3, count: 2, percentage: 3 },
    { stars: 2, count: 1, percentage: 1 },
    { stars: 1, count: 0, percentage: 0 }
  ];

  const customerReviews: CustomerReview[] = [
    {
      id: '1',
      customerName: 'Serena Smith',
      rating: 4,
      orderId: '13456787',
      deliveryDate: 'May 7, 2021 11:50AM',
      comment: 'Great service, food arrived on time and was still hot!'
    },
    {
      id: '2',
      customerName: 'Tomomi Eagle',
      rating: 5,
      orderId: '13456787',
      deliveryDate: 'May 7, 2021 11:50AM',
      comment: 'Excellent delivery service. Very professional and courteous.'
    },
    {
      id: '3',
      customerName: 'Marcus Johnson',
      rating: 5,
      orderId: '13456788',
      deliveryDate: 'May 6, 2021 2:30PM',
      comment: 'Ferdinand was amazing! Quick delivery and very friendly.'
    },
    {
      id: '4',
      customerName: 'Lisa Chen',
      rating: 3,
      orderId: '13456789',
      deliveryDate: 'May 5, 2021 6:45PM',
      comment: 'Delivery took longer than expected but food quality was good.'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-muted-foreground'
        }`}
      />
    ));
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-8">
        <img 
          src={emptyRatingsIllustration} 
          alt="Empty ratings illustration" 
          className="w-32 h-32 object-contain opacity-80"
        />
      </div>
      <h3 className="text-2xl font-bold mb-2">No reviews yet</h3>
      <p className="text-muted-foreground text-center max-w-md">
        Complete more deliveries to start receiving customer feedback and ratings.
      </p>
    </div>
  );

  return (
    <div className={`min-h-screen bg-primary ${isPWA ? 'pt-[110px] lg:pt-[64px]' : 'pt-[70px] lg:pt-[48px]'}`}>
      <UnifiedHeader />
      <DesktopSidebar />
      
      {/* Main Content */}
      <div className="lg:ml-64 bg-background">
        <div className={`container mx-auto px-4 space-y-6 lg:px-3 ${isPWA ? 'py-4 lg:pt-4 lg:pb-4' : 'py-2 lg:pt-2 lg:pb-4'}`}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2 lg:text-3xl">Ratings</h1>
              <p className="text-muted-foreground lg:text-lg">Track your performance and customer feedback</p>
            </div>
            
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Last 7 days">Last 7 days</SelectItem>
                <SelectItem value="Last 30 days">Last 30 days</SelectItem>
                <SelectItem value="Last 90 days">Last 90 days</SelectItem>
                <SelectItem value="Last year">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!hasReviews ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Customer Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EmptyState />
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-muted-foreground">Average Rating</h3>
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      </div>
                      
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold">{averageRating}</span>
                        <span className="text-xl text-muted-foreground">/5</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className="bg-green-100 text-green-700 hover:bg-green-100"
                        >
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +{ratingChange}%
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Compared to previous 30 days
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-muted-foreground">Ratings Received</h3>
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold">{totalRatings}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className="bg-red-100 text-red-700 hover:bg-red-100"
                        >
                          <TrendingDown className="w-3 h-3 mr-1" />
                          {ratingsChange}%
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Compared to previous 30 days
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Rating Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Rating Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ratingDistribution.map((rating) => (
                    <div key={rating.stars} className="flex items-center gap-4">
                      <div className="flex items-center gap-1 w-8">
                        <span className="text-sm font-medium">{rating.stars}</span>
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      </div>
                      
                      <div className="flex-1">
                        <Progress 
                          value={rating.percentage} 
                          className="h-2"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2 min-w-[80px] justify-end">
                        <span className="text-sm font-medium">{rating.count}</span>
                        <span className="text-sm text-muted-foreground">
                          ({rating.percentage}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Customer Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Customer Reviews ({customerReviews.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {customerReviews.map((review) => (
                    <div key={review.id} className="space-y-3">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={review.customerAvatar} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold">
                            {review.customerName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{review.customerName}</h4>
                            <div className="flex items-center gap-1">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">Order ID:</span> {review.orderId}
                            </div>
                            <div>
                              <span className="font-medium">Delivery Date:</span> {review.deliveryDate}
                            </div>
                          </div>
                          
                          {review.comment && (
                            <div className="bg-muted/50 rounded-lg p-3 mt-2">
                              <p className="text-sm">{review.comment}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ratings;